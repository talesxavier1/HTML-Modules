import { IOptionUI } from "Interfaces/IOptionUI";
import { MulticastInModel } from "../../../models/MulticastInModel";
import { TDataSource } from "../../../Types/TDataSource";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";


export class MulticastInOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<MulticastInModel>(new MulticastInModel());
    private data: MulticastInModel;
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
        this.data = data as MulticastInModel;
        this.optionsHTMLContainer = optionsHTMLContainer
        this.hideShowHTMLContainer("SHOW");

        /* ID */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "ID",
            instance: $('#multicastIn_options_ID').dxTextBox({
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
            instance: $('#multicastIn_options_shapeType').dxTextBox({
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
            instance: $('#multicastIn_options_type').dxTextBox({
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
            instance: $('#multicastIn_options_text').dxTextBox({
                value: this.data.text ? this.data.text : "",
                label: "Text",
                readOnly: true,
                visible: true
            }).dxTextBox("instance")
        }));

        /* trackName */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "trackName",
            instance: $('#multicastIn_options_trackName').dxTextBox({
                value: this.data.trackName ? this.data.trackName : "",
                label: "Track Name",
                readOnly: true
            }).dxTextBox("instance")
        }));

    }
}