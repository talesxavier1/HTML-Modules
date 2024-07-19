import { TDataSource } from "Types/TDataSource";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { ScriptModel } from "../../../models/ScriptModel";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { TESTE_AAA } from "../../../Utils/dx-utils/Consts";
import { Utils } from "../../../Utils/Utils";
import { TMonacoLanguage } from "../../../Types/TMonacoLanguage";
import { LanguageStore } from "../../../Data/LanguageStore";

interface ITabScriptOptions {
    id: string,
    title: string,
    html: JQuery<HTMLElement>
}

export class ScriptOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private data: ScriptModel;
    private fileProvider: DevExpress.fileManagement.ObjectFileSystemProvider;

    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject,
            scriptDirectoryContent: (this.fileProvider as any)._data
        } as ScriptModel;
    };

    distroyUI = () => {
        this.componentInstanceModel.disposeAllInstances();
    };

    repaint = () => {
        this.componentInstanceModel.repaintAllInstances();
    };


    constructor(data: TDataSource, readonly: boolean = false) {
        this.data = data as ScriptModel;
        this.fileProvider = new DevExpress.fileManagement.ObjectFileSystemProvider({
            //data: this.data.scriptDirectoryContent
            data: TESTE_AAA
        });

        const dataSource: Array<ITabScriptOptions> = [
            {
                id: "scriptFileManager",
                title: "File Manager",
                html: $(`<div id="scriptFileManager"></div>`)
            },
            {
                id: "scriptOptions",
                title: "Options",
                html: $(`
                    <div id="scriptOptions">
                        <div id="teste_btn">
                        </div>
                    </div>
                `)
            }
        ];

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTabPanel",
            tagName: "scriptTabContainer",
            instance: $('#scriptTabContainer').dxTabPanel({
                height: "100%",
                dataSource: dataSource,
                selectedIndex: 0,
                loop: false,
                animationEnabled: true,
                swipeEnabled: true,
                deferRendering: false,
                itemTitleTemplate: (data: ITabScriptOptions) => {
                    return data.title;
                },
                itemTemplate: (data: ITabScriptOptions) => {
                    return data.html
                },
            }).dxTabPanel("instance")
        }))


        const btnSalvarVisualizarClick = async () => {
            let instance = this.componentInstanceModel.getInstanceProps("scriptFileManager").getInstance() as DevExpress.ui.dxFileManager;
            let selectedItem = instance.getSelectedItems();
            let dataItem = selectedItem[0].dataItem;
            let language = LanguageStore.getLenguageFromFileName(dataItem.name);

            const scriptPopUp = new ScriptPopUp(false, language);
            await scriptPopUp.init();
            scriptPopUp.setContent(atob(dataItem.content));

            let result = await new Promise<string | null>((resolve) => {
                scriptPopUp.onSubmit = (content) => {
                    resolve(content);
                }
                scriptPopUp.onPopUpHidden = () => {
                    resolve(null);
                }
            });
            if (!readonly && result) {
                selectedItem[0].dataItem.content = result;
                instance.refresh();
            }
        }

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxFileManager",
            tagName: "scriptFileManager",
            instance: $('#scriptFileManager').dxFileManager({
                fileSystemProvider: this.fileProvider,
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
                },
            }).dxFileManager("instance"),
        }));
    }

}


class ScriptPopUp {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private readonly: boolean;
    private monacoLanguage: TMonacoLanguage;

    private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
    private onPopUpResize = async () => {
        if (!this.monacoEditor) { return }
        let curretValue = this.monacoEditor.getValue();
        this.monacoEditor.dispose();
        this.monacoEditor = await this.initMonaco(this.monacoLanguage);
        this.monacoEditor.setValue(curretValue);
    }

    private _onPopUpHidden = () => {
        this.componentInstanceModel.disposeAllInstances();
        this.monacoEditor?.dispose();
        this.onPopUpHidden();
    }

    private _onSubmit = () => {
        let value = this.monacoEditor?.getValue();
        this.monacoEditor?.dispose();
        this.componentInstanceModel.disposeAllInstances();
        if (value) {
            this.onSubmit(btoa(value));
        }
        this.onSubmit("");
    }

    private initMonaco = async (language: TMonacoLanguage): Promise<monaco.editor.IStandaloneCodeEditor> => {
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
                });
                resolve(monacoInstance);
            });
        })
    }

    private initDxComponents = (): void => {

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxPopup",
            tagName: "scriptPopUpScript",
            instance: $('#scriptPopUpScript').dxPopup({
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
        this.monacoEditor = await this.initMonaco(this.monacoLanguage);
        loadPanel.hide()
    }

    public setContent = (content: string) => {
        this.monacoEditor?.setValue(content);
    }

    public onSubmit = (content: string) => { }
    public onPopUpHidden = () => { }

    constructor(readonly: boolean, language: TMonacoLanguage) {
        this.readonly = readonly;
        this.monacoLanguage = language;
    }
}



