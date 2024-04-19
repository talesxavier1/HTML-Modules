import { ComponentInstanceModel } from "../lib/dx-utils/ComponentInstanceModel.js";
import { InstanceProps } from "../lib/dx-utils/InstanceProps.js";
import { Utils } from "../lib/dx-utils/Utils.js";
import { EntryModel } from "../models/EntryModel.js";
import { Store } from "./Store.js";




type TDataSource = EntryModel
export class Diagram {
    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);

    private nodeStore = new DevExpress.data.ArrayStore<TDataSource, String>({
        key: 'ID',
        data: [],
        onInserting(data: any) {
            if (data._initialized) { return }
            switch (data.type) {
                case "entry":
                    Object.assign(data, new EntryModel(data.ID));
                    break;
            }
        },
        errorHandler(e: any) {
            console.error(e);
        }
    });

    setDiagramOptions = (strDiagramProps: string, diagramData: Array<any>) => {
        let diagramProps = this.componentInstanceModel.getInstanceProps("diagrama");
        let diagramInstance = diagramProps.getInstance() as DevExpress.ui.dxDiagram;
        diagramInstance.import(strDiagramProps, false);

        diagramData.forEach((VAL: any) => {
            this.nodeStore.update(VAL.ID, VAL);
        });
    }

    private shapeClicked = (event: DevExpress.ui.dxDiagram.ItemClickEvent) => {
        let diagramProps = this.componentInstanceModel.getInstanceProps("diagrama");
        let diagramInstance = diagramProps.getInstance() as DevExpress.ui.dxDiagram;


        let data: any = []
        this.nodeStore.load().done((res: any) => data = res);

        console.clear()
        console.log("export", diagramInstance.export());
        console.log("\n\n\n")
        console.log("data", JSON.stringify(data));
    }

    private customShapes: DevExpress.ui.dxDiagramOptions = {
        customShapes: [
            /* entry */
            {
                type: "entry",
                title: "entry",
                baseType: "rectangle",
                category: "process",
                defaultHeight: 2,
                defaultWidth: 1.5,
                allowResize: false,
                connectionPoints: [
                    { x: 1, y: 0.5 }
                ],
                toolboxTemplate: (container, data: any) => {
                },
                template: (container, data: any) => {
                    let shapeContainer: SVGSVGElement = data[0];
                    let parentElement: SVGGElement = shapeContainer.parentElement as unknown as SVGGElement
                    parentElement.id = "dx_custom_shape_entry";

                    let headerLine = Utils.getNewSVGComponent("line");
                    headerLine.attr({
                        "class": "dx-custom-shape-processContainer-headerLine",
                        "id": "dx_custom_shape_processContainer_headerLine",
                        "x1": "0",
                        "y1": "30",
                        "x2": "100%",
                        "y2": "30",
                        "stroke": "#0000"
                    });
                    headerLine.appendTo(shapeContainer);


                    let headerText = Utils.getNewSVGComponent("text");
                    headerText.attr({ x: '50%', y: '20', })
                    headerText.text("Entry");

                    headerText.appendTo(shapeContainer)
                }
            },
            /* processContainer */
            {
                type: "processContainer",
                title: "processContainer",
                baseType: "verticalContainer",
                category: "process",
                defaultHeight: 3.5,
                defaultWidth: 4,
                minHeight: 3.5,
                minWidth: 7,
                defaultText: "",
                toolboxTemplate: (a, b) => { },
                template: (container, data: any) => {
                    let shapeContainer = $(data);
                    let parentElement = shapeContainer.parent();
                    parentElement.attr("id", "dx_custom_shape_processContainer");
                    parentElement.children().remove();
                    parentElement.append(shapeContainer);

                    parentElement.attr({
                        "fill": "#000"
                    })

                    let headerLine = Utils.getNewSVGComponent("line");
                    headerLine.attr({
                        "class": "dx-custom-shape-processContainer-headerLine",
                        "id": "dx_custom_shape_processContainer_headerLine",
                        "x1": "0",
                        "y1": "35",
                        "x2": "100%",
                        "y2": "35",
                        "stroke": "#0000"
                    });
                    headerLine.appendTo(shapeContainer);

                    let textHeader = Utils.getNewSVGComponent("text");
                    textHeader.attr({
                        "class": "dx_custom_shape_processContainer_header_text participantHeaderText",
                        "fill": "#000",
                        "cursor": "default",
                        "x": "50%",
                        "y": "25",
                    });

                    textHeader.text("Process")
                    textHeader.appendTo(shapeContainer);

                },
                connectionPoints: [{ x: 0, y: 0 }]
            },
            /* start */
            {
                type: "start",
                title: "Start",
                category: "process",
                defaultText: "",
                // allowResize: false,
                // maxHeight: 0.69,
                template: (container, data: any) => {
                    let shapeContainer = $(data);
                    let parentElement = shapeContainer.parent();
                    parentElement.attr("id", "dx_custom_shape_start");


                    let circle = `
                    <svg viewBox="160 -5.1 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs></defs>
  <g transform="matrix(0.991667, 0, 0, 0.991667, 24.658199, 52.933258)">
    <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(250, 250, 250); fill-rule: nonzero; transform-origin: 488.341px 12.113px; paint-order: fill; stroke-width: 5.04202px;" cx="439" cy="244" rx="300" ry="300"></ellipse>
  </g>
  <path d="M 647.974 269.204 L 647.217 269.215 C 630.298 269.626 609.316 270.037 588.155 270.448 C 568.388 270.837 548.466 271.231 531.536 271.62 C 541.282 242.847 560.168 214.253 578.474 186.54 C 595.044 161.465 612.169 135.531 622.292 109.744 L 622.498 109.245 C 622.595 109.017 622.685 108.788 622.778 108.578 C 626.48 105.336 627.292 101.258 624.866 97.436 C 621.863 92.705 614.485 89.401 606.902 89.401 C 602.472 89.401 598.249 90.488 594.726 92.545 C 558.474 113.666 532.474 131.182 510.575 149.195 C 447.491 197.431 374.625 246.618 287.817 299.551 C 287.42 299.8 287.093 300.04 287.162 300.04 C 281.529 303.411 279.557 309.253 282.382 314.238 C 285.083 319.005 291.35 321.852 299.133 321.852 C 333.363 321.852 369.651 321.899 406.303 322.423 C 358.514 387.019 311.585 436.604 259.052 478.061 C 255.111 481.173 253.674 484.996 254.957 488.875 C 256.017 495.367 263.489 500.399 272.177 500.399 C 275.693 500.399 279.231 499.569 282.387 497.982 C 407.604 435.4 539.696 367.976 657.419 292.432 C 658.262 291.896 659.023 291.314 659.722 290.67 C 665.082 287.219 666.975 281.574 664.288 276.715 C 661.696 272.012 655.59 269.204 647.974 269.204 Z M 451.692 316.392 C 454.569 312.37 454.222 307.932 450.744 304.223 C 447.148 300.395 440.685 297.916 434.269 297.916 C 433.405 297.916 432.546 297.963 431.705 298.048 C 401.737 297.42 372.391 297.213 346.217 297.129 C 415.341 253.981 475.107 213.24 528.576 172.848 C 529.926 172.18 531.079 171.428 532.087 170.567 C 533.22 169.59 534.398 168.63 535.563 167.682 L 539.227 164.81 C 539.882 164.323 540.395 163.821 540.89 163.318 C 547.272 158.184 554.042 153.075 561.318 147.9 C 555.731 157.218 549.879 166.563 544.125 175.713 C 523.198 209.096 501.542 243.608 491.678 278.686 C 491.551 279.162 491.473 279.631 491.414 280.076 C 489.249 283.931 489.816 288.419 492.979 291.773 C 496.117 295.086 501.437 296.987 507.594 296.987 L 508.371 296.971 C 523.727 296.593 543.694 296.215 563.568 295.842 C 575.741 295.602 587.877 295.38 598.914 295.15 C 517.693 345.216 431.857 390.954 359.991 427.837 C 391.281 395.475 421.472 358.758 451.692 316.392 Z" style="fill: rgb(7, 7, 12);"></path>
</svg>


                   
                    `


                    $(circle).appendTo(shapeContainer);
                }
            },
        ]
    }


    constructor() {

        this.componentInstanceModel.addInstance(new InstanceProps({
            tagName: "diagrama",
            componentName: "dxDiagram",
            instance: $('#diagrama').dxDiagram({
                toolbox: {
                    groups: [{ category: "process" }, { category: "containers" }]
                },
                onRequestEditOperation(e) {
                    // console.log(e);
                },
                onItemClick: this.shapeClicked,
                customShapes: this.customShapes.customShapes,
                nodes: {
                    dataSource: this.nodeStore,
                    keyExpr: "ID"
                },
                edges: {
                    dataSource: new DevExpress.data.ArrayStore<TDataSource, String>({
                        key: 'ID',
                        data: [],
                    }),
                    keyExpr: "ID"
                },
            }).dxDiagram('instance')
        }));
    }

}


// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="70" viewBox="0 0 640 480" xml:space="preserve">
// <g transform="matrix(5.77 0 0 5.77 311.59 241.25)">
//     <circle style="stroke: rgb(0,0,0); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  cx="0" cy="0" r="40" />
// </g>
// <g transform="matrix(0.79 0 0 0.79 310.93 241.33)" id="Capa_1"  >
//     <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  transform=" translate(-241.1, -241.1)" d="M 389.149 210.959 l -0.594 0.01 c -13.325 0.478 -29.849 0.962 -46.515 1.444 c -15.568 0.457 -31.26 0.922 -44.595 1.384 c 7.673 -33.763 22.552 -67.311 36.968 -99.828 c 13.051 -29.419 26.538 -59.844 34.51 -90.096 l 0.163 -0.594 c 0.076 -0.264 0.147 -0.531 0.218 -0.78 c 2.92 -3.806 3.555 -8.584 1.646 -13.073 C 368.588 3.88 362.774 0 356.802 0 c -3.493 0 -6.814 1.274 -9.592 3.691 c -28.549 24.783 -49.028 45.329 -66.278 66.466 c -49.68 56.594 -107.071 114.303 -175.438 176.409 c -0.317 0.284 -0.571 0.568 -0.516 0.568 c -4.44 3.961 -5.989 10.812 -3.763 16.661 c 2.125 5.591 7.061 8.932 13.195 8.932 c 26.956 0 55.535 0.057 84.401 0.671 c -37.638 75.789 -74.598 133.967 -115.973 182.604 c -3.101 3.646 -4.233 8.136 -3.225 12.686 c 0.833 7.616 6.718 13.522 13.561 13.522 c 2.772 0 5.555 -0.98 8.046 -2.834 c 98.614 -73.428 202.654 -152.532 295.368 -241.166 c 0.665 -0.632 1.265 -1.315 1.813 -2.069 c 4.225 -4.044 5.717 -10.668 3.595 -16.374 C 399.956 214.25 395.152 210.959 389.149 210.959 z M 234.561 266.319 c 2.265 -4.723 1.991 -9.922 -0.749 -14.279 c -2.829 -4.488 -7.919 -7.394 -12.974 -7.394 c -0.681 0 -1.358 0.051 -2.019 0.152 c -23.603 -0.738 -46.715 -0.982 -67.332 -1.081 c 54.441 -50.62 101.511 -98.417 143.628 -145.814 c 1.061 -0.784 1.97 -1.663 2.762 -2.671 c 0.894 -1.15 1.823 -2.275 2.742 -3.387 l 2.885 -3.375 c 0.513 -0.566 0.919 -1.155 1.305 -1.747 c 5.027 -6.018 10.364 -12.022 16.092 -18.091 c -4.402 10.936 -9.013 21.896 -13.543 32.639 c -16.482 39.162 -33.534 79.651 -41.304 120.813 c -0.102 0.559 -0.162 1.104 -0.208 1.63 c -1.706 4.517 -1.26 9.786 1.233 13.721 c 2.473 3.89 6.662 6.122 11.507 6.122 l 0.614 -0.018 c 12.091 -0.447 27.817 -0.889 43.473 -1.331 c 9.588 -0.274 19.149 -0.541 27.838 -0.81 c -63.968 58.739 -131.573 112.408 -188.172 155.678 C 186.98 359.104 210.76 316.033 234.561 266.319 z" stroke-linecap="round" />
// </g>
// </svg>