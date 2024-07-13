import { TDataSource } from "Types/TDataSource";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { ScriptModel } from "../../../models/ScriptModel";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";

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

    constructor(data: TDataSource, readonly?: boolean) {
        this.data = data as ScriptModel;

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxButton",
            tagName: "scriptScriptButton",
            instance: $('#scriptScriptButton').dxButton({
                icon: 'images/icons/weather.png',
                text: 'Weather',
                onClick() {
                    new SciptPopUp();
                },
            }).dxButton("instance")
        }));
    }

}


class SciptPopUp {
    private componentInstanceModel = new ComponentInstanceModel<ScriptModel>(new ScriptModel());

    constructor() {
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxPopup",
            tagName: "scriptPopUpScript",
            instance: $('#scriptPopUpScript').dxPopup({
                width: 660,
                height: 540,
                contentTemplate() {
                    return `
                        <div id="teste"></div>
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

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderPath",
            instance: $('#teste').dxTextBox({
                value: "this.data.senderPath",
                label: "Sender Path",
            }).dxTextBox("instance")
        }));
    }
}