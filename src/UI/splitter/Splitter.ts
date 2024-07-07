export class Splitter {

    //#region PRIVATE
    private splitterInstance: DevExpress.ui.dxSplitter;
    //#endregion PRIVATE

    //#region PUBLIC
    public onResizeEnd?: (e: DevExpress.ui.dxSplitter.ResizeEndEvent) => void;

    public repaint = () => {
        this.splitterInstance.repaint();
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

        this.splitterInstance = $('#splitter').dxSplitter({
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
        }).dxSplitter('instance');
    }
}