import { TDataSource } from "Types/TDataSource";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { ScriptModel } from "../../../models/ScriptModel";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { TESTE_AAA } from "../../../Utils/dx-utils/Consts";

interface ITabScriptOptions {
    id: string,
    title: string,
    html: JQuery<HTMLElement>
}
export class ScriptOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());
    private data: ScriptModel;

    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject
        } as ScriptModel;
    };

    distroyUI = () => {
        this.componentInstanceModel.disposeAllInstances();
    };

    repaint = () => {
        this.componentInstanceModel.repaintAllInstances();
    };

    private dataSource: Array<ITabScriptOptions> = [
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
                    <div>
                </div>
            `)
        }
    ]

    constructor(data: TDataSource, readonly?: boolean) {
        this.data = data as ScriptModel;

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTabPanel",
            tagName: "scriptTabContainer",
            instance: $('#scriptTabContainer').dxTabPanel({
                height: "100%",
                dataSource: this.dataSource,
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

        const fileProvider = new DevExpress.fileManagement.ObjectFileSystemProvider({
            data: TESTE_AAA
        });

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxFileManager",
            tagName: "scriptFileManager",
            instance: $('#scriptFileManager').dxFileManager({
                fileSystemProvider: fileProvider,
                itemView: {
                    mode: 'thumbnails',
                },
                height: "100%",
                permissions: {
                    create: true,
                    copy: true,
                    move: true,
                    delete: true,
                    rename: true,
                    upload: true,
                    download: true,
                },
                customizeThumbnail(fileSystemItem) {
                    return ""
                },

            }).dxFileManager("instance"),
        }))

        const a = () => {
            let instance = this.componentInstanceModel.getInstanceProps("scriptFileManager");
            let aaa: any = instance.getInstanceValue()
            let t = (fileProvider as any)._data;
            console.clear()

            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = JSON.stringify(t);
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

        }
        $('#teste_btn').dxButton({
            stylingMode: 'outlined',
            text: 'Outlined',
            type: 'normal',
            width: 120,
            onClick: a,
        });

    }

}


class ScriptPopUp {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());

    constructor() {
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxPopup",
            tagName: "scriptPopUpScript",
            instance: $('#scriptPopUpScript').dxPopup({
                width: "70%",
                height: "90%",
                contentTemplate() {
                    return `
                        <div id="file-manager"></div>
                    `
                },
                onHidden: () => {
                    this.componentInstanceModel.disposeAllInstances();
                },
                visible: true,
                dragEnabled: false,
                hideOnOutsideClick: false,
                showCloseButton: true,
            }).dxPopup("instance")
        }));
        let a: any;



    }
}