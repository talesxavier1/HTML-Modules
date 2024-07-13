import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { SenderModel } from "../../../models/SenderModel";
import { TDataSource } from "../../../Types/TDataSource";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";

export class SenderOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<SenderModel>(new SenderModel());

    private data: SenderModel;

    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject
        } as SenderModel;
    };

    distroyUI = () => {
        this.componentInstanceModel.disposeAllInstances();
    };

    repaint = () => {
        this.componentInstanceModel.repaintAllInstances();
    };


    constructor(data: TDataSource, readonly?: boolean) {
        this.data = data as SenderModel;

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderName",
            instance: $('#senderName').dxTextBox({
                value: this.data.senderName,
                label: "Sender Name",
                readOnly: readonly
            }).dxTextBox("instance")
        }));

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderPath",
            instance: $('#senderPath').dxTextBox({
                value: this.data.senderPath,
                label: "Sender Path",
                readOnly: readonly
            }).dxTextBox("instance")
        }));
    }

}