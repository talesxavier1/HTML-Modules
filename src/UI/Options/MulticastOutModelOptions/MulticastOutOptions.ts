import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { MultcastOutModel } from "../../../models/MulticastOutModel";
import { TDataSource } from "../../../Types/TDataSource";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";

export class MulticastOutOptions implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<MultcastOutModel>(new MultcastOutModel());
    private data: MultcastOutModel;
    public optionsHTMLContainer: string;

    getData = () => {
        return {
            ...this.data,
            ...this.componentInstanceModel.getBuiltObject()
        }
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
        this.data = data as MultcastOutModel;
        this.optionsHTMLContainer = optionsHTMLContainer;
        this.hideShowHTMLContainer("SHOW");

        /* ID */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "ID",
            instance: $('#multicastOut_options_ID').dxTextBox({
                value: this.data.ID,
                readOnly: true,
                label: "ID",
                visible: true
            }).dxTextBox("instance")
        }));

        /* shapeType */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "shapeType",
            instance: $('#multicastOut_options_shapeType').dxTextBox({
                value: this.data.shapeType,
                readOnly: true,
                label: "ShapeType",
                visible: true
            }).dxTextBox("instance")
        }));

        /* type */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "type",
            instance: $('#multicastOut_options_type').dxTextBox({
                value: this.data.type,
                label: "Type",
                readOnly: true,
                visible: true
            }).dxTextBox("instance")
        }));

        /* text */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "text",
            instance: $('#multicastOut_options_text').dxTextBox({
                value: this.data.text ? this.data.text : "",
                label: "Text",
                readOnly: true,
                visible: true
            }).dxTextBox("instance")
        }));


    }

}