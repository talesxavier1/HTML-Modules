import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { SenderModel } from "../../../models/SenderModel";
import { TDataSource } from "../../../Types/TDataSource";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";

export class SenderOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<SenderModel>(new SenderModel());

    private data: TDataSource;

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

    constructor(data: TDataSource) {
        this.data = data;

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderPath",
            instance: $('#senderPath').dxTextBox({
                value: 'John Smith',
                showClearButton: true,
                inputAttr: { 'aria-label': 'Full Name' },
            }).dxTextBox("instance")
        }))



    }

}