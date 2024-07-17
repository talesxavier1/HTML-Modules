import { TDataSource } from "Types/TDataSource";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { ScriptModel } from "../../../models/ScriptModel";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { TESTE_AAA } from "../../../Utils/dx-utils/Consts";
import { Utils } from "../../../Utils/Utils";
import { FunctionProps } from "../../../Utils/dx-utils/FunctionProps";

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
            const scriptPopUp = new ScriptPopUp(readonly);
            await scriptPopUp.init();
            scriptPopUp.setContent(atob(selectedItem[0].dataItem.content));
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


        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxButton",
            tagName: "btn_scriptOption_visualizar_editar",
            instance: $('#btn_scriptOption_visualizar_editar').dxButton({
                stylingMode: 'contained',
                text: readonly ? "Visualizar" : "Editar",
                type: readonly ? 'normal' : 'success',
                // icon: readonly ? "eyeopen" : "edit",
                width: 120,
                onClick: btnSalvarVisualizarClick,
            }).dxButton("instance")
        }));

        //         this.componentInstanceModel.addInstance(new InstanceProps({
        //             componentName: "dxButton",
        //             tagName: "btn_scriptOption_clearSelection",
        //             instance: $('#btn_scriptOption_clearSelection').dxButton({
        //                 stylingMode: 'contained',
        //                 text: "Limpar seleção",
        //                 type: "normal",
        //                 icon: "close",
        //                 width: 150,
        //                 onClick: () => {
        //                     let instance = this.componentInstanceModel.getInstanceProps("scriptFileManager").getInstance() as DevExpress.ui.dxFileManager;
        // instance.
        //                 },
        //             }).dxButton("instance")
        //         }));

    }

}


class ScriptPopUp {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private readonly: boolean;

    private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
    private onPopUpResize = async () => {
        if (!this.monacoEditor) { return }
        let curretValue = this.monacoEditor.getValue();
        this.monacoEditor.dispose();
        this.monacoEditor = await this.initMonaco();
        this.monacoEditor.setValue(curretValue);
    }

    private _onPopUpHidden = () => {
        this.componentInstanceModel.disposeAllInstances();
        this.monacoEditor?.dispose();
        this.onPopUpHidden();
    }

    private _onSubmit = () => {
        this.componentInstanceModel.disposeAllInstances();
        let value = this.monacoEditor?.getValue();
        this.monacoEditor?.dispose();
        if (value) {
            this.onSubmit(btoa(value));
        }
        this.onSubmit("");
    }

    private initMonaco = async (): Promise<monaco.editor.IStandaloneCodeEditor> => {
        return new Promise((resolve) => {
            let CNT_REQUIRE_INSTANCE = (window as any).CNT_REQUIRE_INSTANCE;
            CNT_REQUIRE_INSTANCE.config({
                paths: {
                    'vs': 'https://talesxavier1.github.io/GH-CDN/TypeScriptEditor/lib/monaco-editor/min/vs'
                }
            });
            CNT_REQUIRE_INSTANCE(['vs/editor/editor.main'], function () {
                let comp = document.getElementById('ScriptPopUp');
                if (!comp) { return }
                let monacoInstance = monaco.editor.create(comp, {
                    language: 'typescript',
                    theme: "vs-dark",
                });
                let monacoNode = monacoInstance.getDomNode();
                if (!monacoNode) { monacoInstance.dispose(); return; }
                $(monacoNode).height("100%").width("100%");
                monacoInstance.render
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
                    return `<div id="ScriptPopUp"></div>`
                },
                onHidden: this._onPopUpHidden,
                onResize: Utils.debounce(this.onPopUpResize, 100),
                resizeEnabled: true,
                visible: true,
                dragEnabled: false,
                hideOnOutsideClick: false,
                showCloseButton: true,
                toolbarItems: [{
                    html: `<div id="script_popup_salvar_btn"></div>`,
                    location: "after"
                }]

            }).dxPopup("instance")
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
        this.monacoEditor = await this.initMonaco();
    }

    public setContent = (content: string) => {
        this.monacoEditor?.setValue(content);
    }

    public onSubmit = (content: string) => { }
    public onPopUpHidden = () => { }

    constructor(readonly: boolean) {
        this.readonly = readonly;
    }
}



