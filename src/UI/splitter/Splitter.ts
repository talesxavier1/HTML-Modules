import { InstanceProps } from "../../Utils/dx-utils/InstanceProps";
import { ComponentInstanceModel } from "../../Utils/dx-utils/ComponentInstanceModel";

export class Splitter {

    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);

    public onResizeEnd?: (e: DevExpress.ui.dxSplitter.ResizeEndEvent) => void;
    public onConfirmDeclineBtnClicked?: (button: "DECLINE" | "CONFIRM") => void;
    public repaint = () => {
        this.componentInstanceModel.repaint("splitter");
    }


    public showHideButtonsDeclineConfirm = (action: "SHOW" | "HIDE") => {
        let btnConfirmInstance = this.componentInstanceModel.tryGetInstanceProps("splitter_options_confirm_btn");
        let btnDeclineInstance = this.componentInstanceModel.tryGetInstanceProps("splitter_options_decline_btn");

        if (action == "SHOW" && (!btnConfirmInstance && !btnDeclineInstance)) {
            this.componentInstanceModel.addInstance(new InstanceProps({
                componentName: "dxButton",
                tagName: "splitter_options_confirm_btn",
                instance: $("#splitter_options_confirm_btn").dxButton({
                    icon: "plus",
                    onClick: () => {
                        if (this.onConfirmDeclineBtnClicked) {
                            this.onConfirmDeclineBtnClicked("CONFIRM");
                        }
                    }
                }).dxButton("instance")
            }));

            this.componentInstanceModel.addInstance(new InstanceProps({
                componentName: "dxButton",
                tagName: "splitter_options_decline_btn",
                instance: $("#splitter_options_decline_btn").dxButton({
                    icon: "less",
                    onClick: () => {
                        if (this.onConfirmDeclineBtnClicked) {
                            this.onConfirmDeclineBtnClicked("DECLINE");
                        }
                    }
                }).dxButton("instance")
            }));
        }

        if (action == "HIDE") {
            if (btnConfirmInstance) { this.componentInstanceModel.disposeInstance("splitter_options_confirm_btn") }
            if (btnDeclineInstance) { this.componentInstanceModel.disposeInstance("splitter_options_decline_btn") }
        }
    }


    constructor(htmlDiagram: string, htmlOptions: string) {

        const diagramItem = {
            orientation: 'horizontal',
            resizable: true,
            collapsible: true,
            size: '70%',
            template() {
                return htmlDiagram;
            },
        };

        const optionsItem = {
            collapsible: true,
            splitter: {
                orientation: 'horizontal',
                items: [
                    {
                        resizable: true,
                        collapsible: true,
                        size: '10%',
                        minSize: '5%',
                        template() {
                            return htmlOptions
                        },
                    }
                ],
            },
        }

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxSplitter",
            tagName: "splitter",
            instance: $('#splitter').dxSplitter({
                onResizeEnd: (e) => {
                    if (this.onResizeEnd) {
                        this.onResizeEnd(e);
                    }
                },
                items: [{
                    splitter: {
                        orientation: "vertical",
                        items: [
                            diagramItem,
                            optionsItem
                        ]
                    }
                }]
            }).dxSplitter('instance')
        }));
    }
}