import { InstanceProps } from "../../../Utils/dx-utils/InstanceProps";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { MultcastOutModel } from "../../../models/MulticastOutModel";
import { TDataSource } from "../../../Types/TDataSource";
import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { NodeStore } from "../../../Data/NodeStore";
import { MulticastInModel } from "models/MulticastInModel";
declare const Swal: any;

export class MulticastOutOptions implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<MultcastOutModel>(new MultcastOutModel());
    private data: MultcastOutModel;
    private nodeStore: NodeStore;
    public optionsHTMLContainer: string;
    private declare Swal: any;

    getData = async () => {
        return {
            ...this.data,
            ...this.componentInstanceModel.getBuiltObject()
        }
    };

    distroyUI = async () => {
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

    showTrackNameDialog() {
        let trackNameOptions: Array<string> = (() => {
            let multiCastIn: Array<MulticastInModel> = (() => {
                let query = this.nodeStore.store.createQuery()
                    .filter(["type", "multicastIn"])
                    .filter(["containerKey", this.data.containerKey]);
                let result: Array<any> = [];
                query.enumerate().done((values: Array<any>) => result = values);
                return result;
            })();

            let multiCastInSemOut: Array<MulticastInModel> = (() => {
                if (multiCastIn.length == 0) { return [] }
                return multiCastIn.filter(VALUE => {
                    let result = 0;
                    let query = this.nodeStore.store.createQuery()
                        .filter(["type", "=", "multicastOut"])
                        .filter(["trackNameOrigin", "=", VALUE.trackName])
                    query.count().done((VALUE: number) => result = VALUE);

                    return result == 0;
                });
            })();

            let options: Array<string> = [];
            multiCastInSemOut.forEach((VALUE: MulticastInModel) => {
                options.push(VALUE.trackName)
            });

            return options;
        })();

        Swal.fire({
            title: "Track name origin",
            input: 'select',
            inputOptions: trackNameOptions,
            allowOutsideClick: true,
            heightAuto: false,
            preConfirm: (value: string) => {
                this.data.trackNameOrigin = trackNameOptions[Number(value)];
                this.componentInstanceModel.setInstanceValue("trackNameOrigin", trackNameOptions[Number(value)]);
            }
        });
    }


    constructor(data: TDataSource, readonly: boolean = false, optionsHTMLContainer: string, nodeStore: NodeStore) {
        this.data = data as MultcastOutModel;
        this.optionsHTMLContainer = optionsHTMLContainer;
        this.nodeStore = nodeStore;
        this.hideShowHTMLContainer("SHOW");
        if (!this.data.trackNameOrigin) {
            this.showTrackNameDialog();
        }

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

        /* trackNameOrigin */
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxTextBox",
            tagName: "trackNameOrigin",
            instance: $('#multicastOut_options_trackNameOrigin').dxTextBox({
                value: this.data.trackNameOrigin ? this.data.trackNameOrigin : "",
                label: "Track Name Origin",
                readOnly: true,
                visible: true
            }).dxTextBox("instance")
        }));

    }

}