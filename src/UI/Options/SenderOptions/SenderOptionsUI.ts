import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { SenderModel } from "../../../models/SenderModel";
import { TDataSource } from "../../../Types/TDataSource";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";

export class SenderOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<SenderModel>(new SenderModel());
    private data: SenderModel;
    public optionsHTMLContainer: string;


    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject
        } as SenderModel;
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
        this.data = data as SenderModel;
        this.optionsHTMLContainer = optionsHTMLContainer;
        this.hideShowHTMLContainer("SHOW");

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderName",
            instance: $('#sender_options_senderName').dxTextBox({
                value: this.data.senderName,
                label: "Sender Name",
                readOnly: readonly
            }).dxTextBox("instance")
        }));

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "senderPath",
            instance: $('#sender_options_senderPath').dxTextBox({
                value: this.data.senderPath,
                label: "Sender Path",
                readOnly: readonly
            }).dxTextBox("instance")
        }));
    }

}