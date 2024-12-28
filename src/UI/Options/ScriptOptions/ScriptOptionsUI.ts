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
import { GlobalLoadIndicator } from "../../../UI/GlobalLoadIndicator/GlobalLoadIndicator";
import { StorageModule } from "../../../Modules/StorageModule";
import { APIModule } from "../../../Modules/APIModule";

export class ScriptOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private data: ScriptModel;
    public optionsHTMLContainer: string;
    private tempDirID: string | undefined;
    private scriptManager: ScriptFileManager | undefined;
    private scriptArea: ScriptArea | undefined;
    private readonly: boolean;
    private getFileManagementBaseAPI = (): string => {
        return localStorage.getItem("FILE_MANAGEMENT_BASE_API") ?? "";
    }
    private mountScriptManager = (type: "Script" | "Module" | "") => {
        if (type == "Module") {
            if (this.scriptArea) { this.scriptArea.dispose() }
            this.scriptManager = new ScriptFileManager(this.getFileManagementBaseAPI(), this.data, this.readonly, this.tempDirID);
        } else if (type == "Script") {
            if (this.scriptManager) { this.scriptManager.dispose() }
            this.scriptArea = new ScriptArea();
        } else {
            throw new Error("Não foi possível inicar o editor de script.");
        }
    }

    getData = async () => {
        let newPackageVersionID;
        if (this.scriptManager) {
            newPackageVersionID = await this.scriptManager.pubContent();
        }

        if (this.scriptArea) {
            newPackageVersionID = await this.scriptArea.pubContent();
        }

        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject,
            packageVersionID: newPackageVersionID
        } as ScriptModel;
    };

    distroyUI = async () => {
        this.componentInstanceModel.disposeAllInstances();
        this.hideShowHTMLContainer("HIDE");
        if (this.scriptManager) {
            await this.scriptManager.dispose();
        }
        if (this.scriptArea) {
            this.scriptArea.dispose();
        }
    };

    hideShowHTMLContainer = (action: "SHOW" | "HIDE") => {
        let J_optionsHTMLContainer = $(`#${this.optionsHTMLContainer}`);
        if (!J_optionsHTMLContainer) { return }
        if (action == "SHOW") {
            J_optionsHTMLContainer.show()
        } else {
            J_optionsHTMLContainer.hide()
        }
    };

    repaint = () => {
        this.componentInstanceModel.repaintAllInstances();
        if (this.scriptArea) { this.scriptArea.repaint(); }
        if (this.scriptManager) { this.scriptManager.repaint() }
    };

    constructor(data: TDataSource, readonly: boolean = false, optionsHTMLContainer: string) {
        const self = this;
        this.data = data as ScriptModel;
        this.optionsHTMLContainer = optionsHTMLContainer;
        if (!readonly) { this.tempDirID = Utils.getGuid() }
        this.readonly = readonly;
        this.hideShowHTMLContainer("SHOW");

        /* scriptTabContainer */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTabPanel",
            tagName: "scriptTabContainer",
            instance: $('#script_options_scriptTabContainer').dxTabPanel({
                height: "100%",
                dataSource: [
                    {
                        id: "scriptOptions",
                        title: "Options",
                        html: $(scriptOptionsHtml)
                    },
                    {
                        id: "scriptFileManager",
                        title: "Script Manager",
                        html: $(scriptFileManagerHtml)
                    }
                ],
                selectedIndex: 0,
                animationEnabled: true,
                deferRendering: false,
            }).dxTabPanel("instance")
        }));
        this.mountScriptManager(this.data.scriptType);
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

        /* processID  */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "processID",
            instance: $('#scriptOptions_processID').dxTextBox({
                value: this.data.processID,
                readOnly: true,
                label: "processID"
            }).dxTextBox("instance")
        }));

        /* processVersionID  */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "processVersionID",
            instance: $('#scriptOptions_processVersionID').dxTextBox({
                value: this.data.processVersionID,
                readOnly: true,
                label: "processVersionID"
            }).dxTextBox("instance")
        }));

        /* packageVersionID */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "packageVersionID",
            instance: $('#scriptOptions_packageVersionID').dxTextBox({
                value: this.data.packageVersionID,
                readOnly: true,
                label: "packageVersionID"
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
                    { "ID": "Module", "VALUE": "Module" },
                    { "ID": "Script", "VALUE": "Script" },
                ],
                label: "Script type",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: readonly,
                value: this.data.scriptType ? this.data.scriptType : null,
                onValueChanged(e) {
                    self.mountScriptManager(e.value);
                },
            }).dxSelectBox("instance"),
            "tagName": "scriptType"
        }));
    }
}


class ScriptEditor {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private readonly: boolean;
    private monacoLanguage: TMonacoLanguage;
    private monacoContent: string
    private scriptEditorType: "POPUP" | "BASE";

    private monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
    private _repaint = async () => {
        if (!this.monacoEditor) { return }
        let curretValue = this.monacoEditor.getValue();
        this.monacoEditor.dispose();
        this.monacoEditor = await this.initMonaco(this.monacoLanguage);
        this.monacoEditor.setValue(curretValue);
    }
    public repaint = Utils.debounce(this._repaint, 100);

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
            return value;
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
                let comp = document.getElementById('MonacoArea');
                if (!comp) { return }
                let monacoInstance = monaco.editor.create(comp, {
                    language: language,
                    theme: "vs-dark",
                    value: content ? content : ""
                });
                resolve(monacoInstance);
            });

        })
    }

    private initDxPopupComponents = (): void => {
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxPopup",
            tagName: "scriptPopUpScript",
            instance: $('#script_options_scriptPopUpScript').dxPopup({
                width: "70%",
                height: "90%",
                contentTemplate() {
                    return `
                        <div id="MonacoArea"></div>
                    `
                },
                onHidden: this._onPopUpHidden,
                onResize: this.repaint,
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
        GlobalLoadIndicator.show("ScriptEditor - init");
        if (this.scriptEditorType == "POPUP") {
            this.initDxPopupComponents();
        }
        this.monacoEditor = await this.initMonaco(this.monacoLanguage, this.monacoContent);
        GlobalLoadIndicator.hide("ScriptEditor - init");
    }

    public setContent = (content: string) => {
        this.monacoEditor?.setValue(content);
        this.monacoContent = content;
    }

    public asyncOnCompletedOperation = (): Promise<string | null> => {
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

    constructor(readonly: boolean, language: TMonacoLanguage, scriptEditorType: "POPUP" | "BASE", content?: string) {
        this.readonly = readonly;
        this.monacoLanguage = language;
        this.monacoContent = content ?? "";
        this.scriptEditorType = scriptEditorType;
    }
}

class ScriptArea {
    private scriptEditor: ScriptEditor;

    private lastHeigth: number | null = null;
    private initObserveMonacoAreaSize = () => {
        const elemento = document.getElementById("MonacoArea");
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                let height = entry.contentRect.height;
                if (!this.lastHeigth) {
                    this.lastHeigth = height;
                } else if (this.lastHeigth != height) {
                    this.repaint();
                }

            }
        });
        observer.observe(elemento as HTMLElement);
    }

    public pubContent = async (): Promise<string> => {

        return new Promise((res) => res(""));
    }

    public dispose = () => {
        let monacoArea = $("#MonacoArea");
        if (monacoArea) { monacoArea.remove() }
    }

    public repaint = () => {
        this.scriptEditor.repaint();
    }


    constructor() {
        let monacoArea = $(`<div id="MonacoArea"></div>`);
        $("#scriptFileManager").append(monacoArea);
        this.scriptEditor = new ScriptEditor(false, "javascript", "BASE", "");
        this.scriptEditor.init();
        this.initObserveMonacoAreaSize();
    }
}

class ScriptFileManager {

    private fileManagerinstance: DevExpress.ui.dxFileManager;
    private fileManagerBaseEndPoint: string;
    private data: ScriptModel;
    private tempDirID?: string;
    readonly: boolean;

    public dispose = async () => {
        await this.clearTempDir();
        this.fileManagerinstance.dispose();
    }

    public repaint = () => { }

    private clearTempDir = async () => {
        let url = `${this.fileManagerBaseEndPoint}/file-manager/?command={0}&arguments={1}`;
        url = url.replace("{0}", "ClearTempDir");
        url = url.replace("{1}", "{}");

        await fetch(encodeURI(url), {
            headers: {
                "processID": "28e27b2d-131e-41be-88a8-82fd149f3519",
                "processVersionID": "f0c2e5eb-b72e-4623-93e0-f0e48590290e",
                "packageVersionID": this.data.packageVersionID,
                "packageID": this.data.ID,
                "tempDirID": this.tempDirID ?? ""
            },
            method: "POST"
        }).catch((res) => {
            console.error(res);
        });

    }

    public pubContent = async (): Promise<string> => {
        let url = `${this.fileManagerBaseEndPoint}/file-manager/?command={0}&arguments={1}`;
        url = url.replace("{0}", "PubTempDir");
        url = url.replace("{1}", "{}");

        let response = await fetch(encodeURI(url), {
            headers: {
                "processID": "28e27b2d-131e-41be-88a8-82fd149f3519",
                "processVersionID": "f0c2e5eb-b72e-4623-93e0-f0e48590290e",
                "packageID": this.data.ID,
                "packageVersionID": this.data.packageVersionID,
                "tempDirID": this.tempDirID ?? ""
            },
            method: "POST"
        });
        if (response.ok) {
            let json = await response.json() as APIModule.Response.IContent;
            if (!json.strResult) {
                throw new Error("Sem resposta.")
            }
            let objNewPackageVersionID = Utils.tryparse(json.strResult) as { newPackageVersionID: string } | undefined;
            if (!objNewPackageVersionID) {
                throw new Error("Sem resposta.")
            }
            return objNewPackageVersionID.newPackageVersionID;
        } else {
            throw new Error("Sem resposta.")
        }
    };

    private getFileContent = async (pathInfo: Array<StorageModule.IStorageItemPathInfo>, name: string): Promise<string> => {
        return new Promise((resolve) => {
            let url = `${this.fileManagerBaseEndPoint}/file-manager/?command={0}&arguments={1}`;
            url = url.replace("{0}", "GetFileContent");
            url = url.replace("{1}", JSON.stringify({ "pathInfo": pathInfo, "name": name }));

            fetch(encodeURI(url), {
                headers: {
                    "processID": this.data.processID,
                    "processVersionID": this.data.processVersionID,
                    "packageID": this.data.ID,
                    "packageVersionID": this.data.packageVersionID,
                    "tempDirID": this.tempDirID ?? ""
                },
                method: "GET"
            }).then((response) => {
                if (!response.ok) {
                    resolve("");
                }
                return response.json();
            }).then((body) => {
                resolve(body.strResult);
            });;
        });
    }

    private updateFileContent = async (storageItem: StorageModule.IStorageItem, content: string): Promise<void> => {
        let argumentsPost: APIModule.Request.IArguments = {
            isDirectory: false,
            name: storageItem.name,
            sourceIsDirectory: false,
            pathInfo: storageItem.pathInfo,
            chunkMetadata: JSON.stringify({
                FileName: storageItem.name,
                Index: 0,
                FileSize: 0,
                TotalCount: 1,
                UploadId: Utils.getGuid()
            } as APIModule.Request.IChunkMetadata)
        };

        const body = [
            `------WebKitFormBoundary7TqmsuGGMt2xPEmu`,
            `Content-Disposition: form-data; name="chunk"; filename="blob"`,
            `Content-Type: application/octet-stream`,
            "",
            content,
            `------WebKitFormBoundary7TqmsuGGMt2xPEmu--`,
            ""
        ].join("\r\n");

        GlobalLoadIndicator.show("ScriptFileManager - updateFileContent");
        let response = await fetch(encodeURI(`${this.fileManagerBaseEndPoint}/file-manager/`), {
            headers: {
                "processID": this.data.processID,
                "processVersionID": this.data.processVersionID,
                "packageID": this.data.ID,
                "packageVersionID": this.data.packageVersionID,
                "tempDirID": this.tempDirID ?? "",
                "arguments": JSON.stringify(argumentsPost),
                "command": "UpdateFileContent",
                "Content-Type": `multipart/form-data; boundary=----WebKitFormBoundary7TqmsuGGMt2xPEmu`,

            },

            body: body,
            method: "POST"
        });
        GlobalLoadIndicator.hide("ScriptFileManager - updateFileContent");
        if (!response.ok) {
            throw new Error("Sem resposta.")
        }

    }

    private btnEditarVisualizarClick = async () => {
        let selectedItem: Array<StorageModule.IStorageItem> = this.fileManagerinstance.getSelectedItems();
        if (selectedItem[0].isDirectory) {
            return;
        }

        let dataItem: StorageModule.IStorageItemData = selectedItem[0].dataItem;

        let pathInfo: Array<StorageModule.IStorageItemPathInfo> = JSON.parse(JSON.stringify(selectedItem[0].pathInfo));
        pathInfo.push({
            "key": selectedItem[0].key,
            "name": selectedItem[0].name
        });

        GlobalLoadIndicator.show("ScriptFileManager - btnEditarVisualizarClick");
        let strFile: string = await this.getFileContent(pathInfo, selectedItem[0].name);
        GlobalLoadIndicator.hide("ScriptFileManager - btnEditarVisualizarClick");

        let language = LanguageStore.getLenguageFromFileName(dataItem.name);

        const scriptPopUp = new ScriptEditor(this.readonly, language, "POPUP", strFile);
        await scriptPopUp.init();
        let result: string | null = await scriptPopUp.asyncOnCompletedOperation();
        if (!result) { return }

        if (strFile != result) {
            let copySelectedItem: StorageModule.IStorageItem = JSON.parse(JSON.stringify(selectedItem[0]));
            copySelectedItem.pathInfo = pathInfo;

            await this.updateFileContent(copySelectedItem, result);
        }
    };

    private btnDownloadClick = async () => {
        GlobalLoadIndicator.show("ScriptFileManager - btnDownloadClick");
        let selectedItem = this.fileManagerinstance.getSelectedItems();

        if (selectedItem[0].isDirectory) { return }

        let pathInfo = selectedItem[0].pathInfo;
        let name = selectedItem[0].name;
        pathInfo.push({
            "key": selectedItem[0].key,
            "name": selectedItem[0].name
        });

        let result: Blob | null = await new Promise((resolve) => {
            let url = this.fileManagerBaseEndPoint + "/file-manager/Download";
            let headers: any = {
                "processID": "28e27b2d-131e-41be-88a8-82fd149f3519",
                "processVersionID": "f0c2e5eb-b72e-4623-93e0-f0e48590290e",
                "packageID": this.data.ID,
                "arguments": JSON.stringify({ "pathInfo": pathInfo, "name": name }),
                "_": Utils.getGuid()
            }
            if (this.tempDirID) { headers.tempDirID = this.tempDirID; }

            fetch(url, {
                headers: headers,
                method: "GET"
            }).then((response) => {
                if (!response.ok) {
                    resolve(null);
                }
                return response.blob();
            }).then((blob) => {
                resolve(blob);
            });
        });

        if (result) {
            const url = window.URL.createObjectURL(result);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = name;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        GlobalLoadIndicator.hide("ScriptFileManager - btnDownloadClick");
    };

    constructor(fileManagerBaseEndPoint: string, data: ScriptModel, readonly: boolean, tempDirID?: string,) {

        this.fileManagerBaseEndPoint = fileManagerBaseEndPoint;
        this.data = data;
        this.tempDirID = tempDirID;
        const self = this;
        this.readonly = readonly;

        const provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
            endpointUrl: `${fileManagerBaseEndPoint}/file-manager/`,
            beforeAjaxSend: (options) => {
                options.headers.processID = data.processID;
                options.headers.processVersionID = data.processVersionID;
                options.headers.packageID = data.ID;
                options.headers.packageVersionID = data.packageVersionID;
                options.headers.tempDirID = tempDirID ? tempDirID : "";

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
            }
        });

        this.fileManagerinstance = $('#scriptFileManager').dxFileManager({
            fileSystemProvider: provider,
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
                    {
                        widget: "dxButton",
                        options: {
                            text: "download",
                            icon: "download",
                            location: 'before'
                        },
                    }, "separator",
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
                        }
                    }
                ],
            },
            async onToolbarItemClick(evt) {
                if (["Visualizar", "Editar"].includes(evt?.itemData?.options?.text)) {
                    await self.btnEditarVisualizarClick();
                } else if (evt?.itemData?.options?.text == "download") {
                    await self.btnDownloadClick();
                }
            }
        }).dxFileManager("instance");
    }
}





