import { InstanceProps } from "../../Utils/dx-utils/InstanceProps";
import { ComponentInstanceModel } from "../../Utils/dx-utils/ComponentInstanceModel";

export class Splitter {

    //#region PRIVATE
    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);
    //#endregion PRIVATE

    //#region PUBLIC
    public onResizeEnd?: (e: DevExpress.ui.dxSplitter.ResizeEndEvent) => void;

    public repaint = () => {
        this.componentInstanceModel.repaint("splitter");
    }
    //#endregion

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