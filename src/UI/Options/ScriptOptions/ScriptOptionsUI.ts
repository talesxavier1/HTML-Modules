import { TDataSource } from "Types/TDataSource";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { ScriptModel } from "../../../models/ScriptModel";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { Utils } from "../../../Utils/Utils";
import { TMonacoLanguage } from "../../../Types/TMonacoLanguage";
import { LanguageStore } from "../../../Data/LanguageStore";
import scriptFileManagerHtml from "../../../html/ScriptOptions/ScriptFileManager.html";
import scriptOptionsHtml from "../../../html/ScriptOptions/ScriptOptions.html";

export class ScriptOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private data: ScriptModel;
    public optionsHTMLContainer: string;

    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject
        } as ScriptModel;
    };

    distroyUI = () => {
        this.componentInstanceModel.disposeAllInstances();
        this.hideShowHTMLContainer("HIDE");
    };

    hideShowHTMLContainer = (action: "SHOW" | "HIDE") => {
        let J_optionsHTMLContainer = $(`#${this.optionsHTMLContainer}`);
        if (!J_optionsHTMLContainer) { return }
        if (action == "SHOW") {
            J_optionsHTMLContainer.show()
        } else {
            J_optionsHTMLContainer.hide()
        }
    }

    repaint = () => {
        this.componentInstanceModel.repaintAllInstances();
    };

    constructor(data: TDataSource, readonly: boolean = false, optionsHTMLContainer: string) {
        this.data = data as ScriptModel;
        this.optionsHTMLContainer = optionsHTMLContainer;
        this.hideShowHTMLContainer("SHOW");

        /* scriptTabContainer */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTabPanel",
            tagName: "scriptTabContainer",
            instance: $('#script_options_scriptTabContainer').dxTabPanel({
                height: "100%",
                dataSource: [
                    {
                        id: "scriptFileManager",
                        title: "File Manager",
                        html: $(scriptFileManagerHtml)
                    },
                    {
                        id: "scriptOptions",
                        title: "Options",
                        html: $(scriptOptionsHtml)
                    }
                ],
                selectedIndex: 0,
                animationEnabled: true,
                deferRendering: false,
            }).dxTabPanel("instance")
        }));

        /* scriptDirectoryContent */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "ObjectFileSystemProvider",
            tagName: "scriptDirectoryContent",
            instance: new DevExpress.fileManagement.ObjectFileSystemProvider({
                data: this.data.scriptDirectoryContent,
            })
        }));

        const provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
            endpointUrl: 'http://localhost:9090/file-manager/',
            beforeAjaxSend(options) {
                let argumentsFormData = options?.formData?.arguments;
                if (argumentsFormData) {
                    options.headers.arguments = argumentsFormData;
                    delete options?.formData?.arguments;
                }
                let commandFormData = options?.formData?.command;
                if (commandFormData) {
                    options.headers.command = commandFormData;
                    delete options?.formData?.command;
                }
            },
        });

        /* scriptFileManager */
        const btnSalvarVisualizarClick = async () => {
            let instance = this.componentInstanceModel.getInstanceProps("scriptFileManager").getInstance() as DevExpress.ui.dxFileManager;
            let selectedItem = instance.getSelectedItems();
            let dataItem = selectedItem[0].dataItem;
            let language = LanguageStore.getLenguageFromFileName(dataItem.name);

            const scriptPopUp = new ScriptPopUp(false, language, atob(dataItem.content));
            await scriptPopUp.init();

            let result: String | null = await scriptPopUp.asyncOnCompletedOperation();
            if (!readonly && typeof result == "string") {
                selectedItem[0].dataItem.content = result;
                instance.refresh();
            }
        }
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxFileManager",
            tagName: "scriptFileManager",
            instance: $('#scriptFileManager').dxFileManager({
                fileSystemProvider: provider,
                //fileSystemProvider: this.componentInstanceModel.getInstanceProps("scriptDirectoryContent").getInstance(),
                itemView: {
                    mode: 'thumbnails',
                },
                height: "100%",
                permissions: {
                    create: !readonly,
                    copy: !readonly,
                    move: !readonly,
                    delete: !readonly,
                    rename: !readonly,
                    upload: !readonly,
                    download: !readonly,
                },
                customizeThumbnail(fileSystemItem) {
                    return ""
                },
                selectionMode: "single",
                toolbar: {
                    fileSelectionItems: [
                        "download", "separator",
                        "move", "separator",
                        "copy", "separator",
                        "rename", "separator",
                        "delete", "separator",
                        "clearSelection", "separator",
                        {
                            widget: "dxButton",
                            options: {
                                text: readonly ? "Visualizar" : "Editar",
                                icon: readonly ? "eyeopen" : "edit",
                                location: 'before'
                            },

                        }
                    ],
                },
                async onToolbarItemClick(evt) {
                    if (["Visualizar", "Editar"].includes(evt?.itemData?.options?.text)) {
                        await btnSalvarVisualizarClick();
                    }
                }
            }).dxFileManager("instance"),
        }));

        /* ID */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "ID",
            instance: $('#scriptOptions_ID').dxTextBox({
                value: this.data.ID,
                readOnly: true,
                label: "ID"
            }).dxTextBox("instance")
        }));

        /* shapeType */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "shapeType",
            instance: $('#scriptOptions_shapeType').dxTextBox({
                value: this.data.shapeType,
                readOnly: true,
                label: "ShapeType"
            }).dxTextBox("instance")
        }));

        /* type */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "type",
            instance: $('#scriptOptions_type').dxTextBox({
                value: this.data.type,
                label: "Type",
                readOnly: true
            }).dxTextBox("instance")
        }));

        /* text */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "text",
            instance: $('#scriptOptions_text').dxTextBox({
                value: this.data.text ? this.data.text : "",
                label: "Text",
                readOnly: true
            }).dxTextBox("instance")
        }));

        /* scriptType */
        this.componentInstanceModel.addInstance(new InstanceProps({
            "componentName": "dxSelectBox",
            "instance": $("#scriptOptions_scriptType").dxSelectBox({
                dataSource: [
                    { "ID": "", "VALUE": "" },
                    { "ID": "nodejs", "VALUE": "nodeJs" },
                    { "ID": "typescript", "VALUE": "typeScript" },
                    { "ID": "groovy", "VALUE": "Groovy" }
                ],
                label: "Format",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: readonly,
                value: this.data.scriptType ? this.data.scriptType : null
            }).dxSelectBox("instance"),
            "tagName": "scriptType"
        }));

    }
}

//TODO Precisa de dispose aqui.
class ScriptPopUp {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private readonly: boolean;
    private monacoLanguage: TMonacoLanguage;
    private monacoContent: string

    private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
    private onPopUpResize = async () => {
        if (!this.monacoEditor) { return }
        let curretValue = this.monacoEditor.getValue();
        this.monacoEditor.dispose();
        this.monacoEditor = await this.initMonaco(this.monacoLanguage);
        this.monacoEditor.setValue(curretValue);
    }

    private _asyncOnCompletedOperation?: (content: string | null) => void;

    private _asyncOnPopUpHidden?: () => void;
    private _onPopUpHidden = () => {
        this.componentInstanceModel.disposeAllInstances();
        this.monacoEditor?.dispose();
        this.onPopUpHidden ? this.onPopUpHidden() : "";
        this._asyncOnCompletedOperation ? this._asyncOnCompletedOperation(null) : "";
        this._asyncOnPopUpHidden ? this._asyncOnPopUpHidden() : "";
    }

    private _asyncOnSubmit?: (content: string) => void
    private _onSubmit = () => {
        let value = (() => {
            let value = this.monacoEditor?.getValue();
            if (!value) { return "" }
            return btoa(value);
        })();
        this.monacoEditor?.getValue() ?? "";
        this.monacoEditor?.dispose();
        this.componentInstanceModel.disposeAllInstances();

        this.onSubmit ? this.onSubmit(value) : "";
        this._asyncOnSubmit ? this._asyncOnSubmit(value) : "";
        this._asyncOnCompletedOperation ? this._asyncOnCompletedOperation(value) : "";
    }

    private initMonaco = async (language: TMonacoLanguage, content?: string): Promise<monaco.editor.IStandaloneCodeEditor> => {
        return new Promise((resolve) => {
            requirejs.config({
                paths: {
                    'vs': 'https://talesxavier1.github.io/GH-CDN/TypeScriptEditor/lib/monaco-editor/min/vs'
                }
            });
            requirejs(['vs/editor/editor.main'], function () {
                let comp = document.getElementById('ScriptPopUp');
                if (!comp) { return }
                let monacoInstance = monaco.editor.create(comp, {
                    language: language,
                    theme: "vs-dark",
                    value: content ?? ""
                });
                resolve(monacoInstance);
            });
        })
    }

    private initDxComponents = (): void => {

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxPopup",
            tagName: "scriptPopUpScript",
            instance: $('#script_options_scriptPopUpScript').dxPopup({
                width: "70%",
                height: "90%",
                contentTemplate() {
                    return `
                        <div id="loadPanel"></div>
                        <div id="ScriptPopUp"></div>
                    `
                },
                onHidden: this._onPopUpHidden,
                onResize: Utils.debounce(this.onPopUpResize, 100),
                onContentReady(e: any) {
                    if (!e.component["_$wrapper"]) { return }
                    let wrapper = $(e.component["_$wrapper"]);
                    wrapper.attr("id", "scriptPopUpScript_wrapper");
                    let children = wrapper.children();
                    children.attr("id", "scriptPopUpScript_wrapper_children");
                },
                resizeEnabled: true,
                visible: true,
                dragEnabled: false,
                hideOnOutsideClick: false,
                showCloseButton: true,
                toolbarItems: [{
                    html: `<div id="script_popup_salvar_btn"></div>`,
                    location: "after"
                }],
            }).dxPopup("instance")
        }));

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxLoadPanel",
            tagName: "loadPanel",
            instance: $('#loadPanel').dxLoadPanel({
                shadingColor: 'rgba(0,0,0,0.4)',
                position: { of: "#scriptPopUpScript_wrapper_children" },
                visible: false,
                showIndicator: true,
                showPane: true,
                shading: true,
                hideOnOutsideClick: false,
                onShown(e: any) {
                    if (!e.component["_$wrapper"]) { return }
                    let wrapper = $(e.component["_$wrapper"]);
                    let scriptPopUpScript_wrapper = $("#scriptPopUpScript_wrapper");
                    let scriptPopUpScript_zIndex = scriptPopUpScript_wrapper.css("z-index");
                    $(wrapper).css("z-index", Number(scriptPopUpScript_zIndex) + 2);
                },
            }).dxLoadPanel('instance')
        }));

        if (!this.readonly) {
            this.componentInstanceModel.addInstance(new InstanceProps({
                componentName: "dxButton",
                tagName: "script_popup_salvar_btn",
                instance: $('#script_popup_salvar_btn').dxButton({
                    stylingMode: 'contained',
                    text: 'Salvar',
                    type: 'success',
                    width: 120,
                    onClick: this._onSubmit,
                }).dxButton("instance"),
            }));
        }
    }

    public init = async () => {
        this.initDxComponents();
        let loadPanel = this.componentInstanceModel.getInstanceProps("loadPanel").getInstance() as DevExpress.ui.dxLoadPanel;
        loadPanel.show();
        this.monacoEditor = await this.initMonaco(this.monacoLanguage, this.monacoContent);
        loadPanel.hide()
    }

    public setContent = (content: string) => {
        this.monacoEditor?.setValue(content);
        this.monacoContent = content;
    }

    public asyncOnCompletedOperation = (): Promise<String | null> => {
        return new Promise((resolve) => {
            this._asyncOnCompletedOperation = (content: string | null) => {
                resolve(content)
            }
        });
    }

    public asyncOnSubmit = (): Promise<string> => {
        return new Promise((resolve) => {
            this._asyncOnSubmit = (content) => {
                resolve(content)
            }
        });
    }

    public onSubmit?: (content: string) => void
    public onPopUpHidden?: () => void

    constructor(readonly: boolean, language: TMonacoLanguage, content?: string) {
        this.readonly = readonly;
        this.monacoLanguage = language;
        this.monacoContent = content ?? "";
    }
}



