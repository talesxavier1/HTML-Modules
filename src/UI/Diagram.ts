import { ComponentInstanceModel } from "../lib/dx-utils/ComponentInstanceModel.js";
import { InstanceProps } from "../lib/dx-utils/InstanceProps.js";
import { Utils } from "../lib/dx-utils/Utils.js";
import { SenderModel } from "../models/SenderModel.js";
import { ProcessContainerModel } from "../models/ProcessContainerModel.js";
import { ReciverModel } from "../models/ReciverModel.js";
import { DataConverterModel } from "../models/DataConverterModel.js";
import { ExceptionSubprocessModel } from "../models/ExceptionSubprocessModel.js";
import { ScriptModel } from "../models/ScriptModel.js";
import { EndExceptioModel } from "../models/EndExceptionModel.js";
import { StartExceptionModel } from "../models/startExceptionModel.js";
import { MultcastOutModel } from "../models/MulticastOutModel.js";
import { MultcastInModel } from "../models/MulticastInModel.js";
import { EndProcessModel } from "../models/EndProcessModel.js";
import { StartProcessModel } from "../models/StartProcessModel.js";
import { ConditionModel } from "../models/ConditionModel.js";


export class Diagram {
    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);

    private nodeStore = new NodeStore("ID");

    setDiagramOptions = (strDiagramProps: string, diagramData: Array<any>) => {
        let diagramProps = this.componentInstanceModel.getInstanceProps("diagrama");
        let diagramInstance = diagramProps.getInstance() as DevExpress.ui.dxDiagram;
        diagramInstance.import(strDiagramProps, false);

        diagramData.forEach((VAL: any) => {
            this.nodeStore.store.update(VAL.ID, VAL);
        });
    }

    private shapeClicked = (event: DevExpress.ui.dxDiagram.ItemClickEvent) => {

        let diagramProps = this.componentInstanceModel.getInstanceProps("diagrama");
        let diagramInstance = diagramProps.getInstance() as DevExpress.ui.dxDiagram;

        let data = this.nodeStore.getAll();

        console.clear()
        console.log("export", diagramInstance.export());
        console.log("\n\n\n")
        console.log("data", JSON.stringify(data));
    }

    private customShapes: DevExpress.ui.dxDiagramOptions = {
        customShapes: [
            new SenderCustonShape().shape, /* Sender */
            new ReciverCustonShape().shape, /* Reciver */
            new ProcessContainerCustonShape().shape, /* Process Container */
            new StartProcessCustonShape().shape, /* Start Process */
            new EndProcessCustonShape().shape, /* End Process */
            new MulticastInCustonShape().shape, /* Multicast In */
            new MulticastOutCustonShape().shape,/* Multicast Out */
            new StartExceptionCustonShape().shape, /* Start Exception */
            new DataConverterCustonShape().shape, /* Data Converter */
            new ScriptCustonShape().shape, /* Script */
            new EndExceptionCustonShape().shape, /* End Exception */
            new ExceptionSubprocessCustonShape().shape, /* Exception Subprocess */
            new ConditionCustonShape().shape, /* Condition */
        ]
    }

    private onRequestEditOperation = (event: DevExpress.ui.dxDiagram.RequestEditOperationEvent) => {
        if (event.operation == "addShapeFromToolbox") { return }
        console.log(event)
        let aa = (event.args as any)?.shape?.containerId;
        if (aa) {
            let a: any = (this.componentInstanceModel.getInstanceProps("diagrama").getInstance() as DevExpress.ui.dxDiagram).getItemById(aa);
            if (a && a.type == "processContainer") {
                //event.allowed = false;
            }
        }
        //
        // let args = event.args as any;
        // if (event.operation == "changeConnection") {
        //     let from = args?.connector?.fromKey
        //     let to = args?.connector?.toKey

        //     if (from && to) {
        //         let nodeFrom: any = (() => {
        //             let result;
        //             this.nodeStore.byKey(from).done((val: any) => result = val);
        //             return result;
        //         })();


        //         let nodeTo: any = (() => {
        //             let result;
        //             this.nodeStore.byKey(to).done((val: any) => result = val);
        //             return result;
        //         })();

        //         if (nodeFrom.type == "converter" && nodeTo.type == "script") {
        //             event.allowed = false;
        //         }

        //     }

        //     // console.log("from:", from, "\n", "to:", to, "\n")
        // }
    }

    constructor() {
        this.componentInstanceModel.addInstance(new InstanceProps({
            tagName: "diagrama",
            componentName: "dxDiagram",
            instance: $('#diagrama').dxDiagram({
                toolbox: {
                    groups: [{ category: "Process" }, { category: "Exception" }]
                },
                onRequestEditOperation: this.onRequestEditOperation,
                onItemClick: this.shapeClicked,
                customShapes: this.customShapes.customShapes,
                nodes: {
                    dataSource: this.nodeStore.store,
                    keyExpr: "ID"
                },
                edges: {
                    dataSource: new DevExpress.data.ArrayStore<TDataSource, String>({
                        key: 'ID',
                        data: [],
                    }),
                    keyExpr: "ID",
                },
                showGrid: false,
                snapToGrid: false,
                simpleView: true,
                readOnly: false,

            }).dxDiagram('instance')
        }));
    }
}

// #region TDataSource
type TDataSource =
    SenderModel |
    ProcessContainerModel |
    ReciverModel |
    ConditionModel |
    ExceptionSubprocessModel |
    EndExceptioModel |
    ScriptModel |
    DataConverterModel |
    StartExceptionModel |
    MultcastOutModel |
    MultcastInModel |
    StartProcessModel |
    EndProcessModel;
// #endregion
class NodeStore {

    private _store: DevExpress.data.ArrayStore<TDataSource, String>;

    private onInserting = (data: TDataSource): void => {
        if (data.initialized) { return }
        switch (data.type) {
            case "sender":
                Object.assign(data, new SenderModel(data.ID));
                break;
            case "processContainer":
                Object.assign(data, new ProcessContainerModel(data.ID));
                break;
            case "reciver":
                Object.assign(data, new ReciverModel(data.ID));
                break;
            case "condition":
                Object.assign(data, new ConditionModel(data.ID));
                break;
            case "exceptionSubprocess":
                Object.assign(data, new ExceptionSubprocessModel(data.ID));
                break;
            case "endException":
                Object.assign(data, new EndExceptioModel(data.ID));
                break;
            case "script":
                Object.assign(data, new ScriptModel(data.ID));
                break;
            case "dataConverter":
                Object.assign(data, new DataConverterModel(data.ID));
                break;
            case "startException":
                Object.assign(data, new StartExceptionModel(data.ID));
                break;
            case "multicastOut":
                Object.assign(data, new MultcastOutModel(data.ID));
                break;
            case "multicastIn":
                Object.assign(data, new MultcastInModel(data.ID));
                break;
            case "endProcess":
                Object.assign(data, new EndProcessModel(data.ID));
                break;
            case "startProcess":
                Object.assign(data, new StartProcessModel(data.ID));
                break;
            default:
                new Error(`[Erro] tipo "${data.type}" não encontrado.`);
        }
    }

    private errorHandler = (Error: any): void => {
        debugger;
    }

    public getAll = (): Array<TDataSource> => {
        let data: Array<TDataSource> = []
        this._store.load().done((res: Array<TDataSource>) => data = res);
        return data;
    }

    constructor(key: string) {
        this._store = new DevExpress.data.ArrayStore<TDataSource, String>({
            key: key,
            data: [],
            onInserting: this.onInserting,
            errorHandler: this.errorHandler
        });
    }

    get store(): DevExpress.data.ArrayStore<TDataSource, String> {
        return this._store
    }
}

// #region CustonShape
class SenderCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg  viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.070778, 0, 0, -0.067442, 1.70092, 498.174286)" fill="#000000" stroke="none">
                    <path d="M1485 7330 c-112 -29 -179 -58 -257 -109 -167 -111 -285 -268 -348 -466 -28 -88 -39 -284 -20 -377 21 -109 82 -278 101 -278 4 0 10 -11 13 -25 4 -14 11 -25 16 -25 6 0 10 -5 10 -12 0 -6 6 -18 14 -27 93 -103 120 -130 126 -126 4 3 15 -7 24 -20 9 -14 21 -23 25 -20 5 3 12 -2 15 -11 4 -9 9 -14 12 -11 3 3 14 -3 25 -14 11 -11 24 -17 29 -14 6 4 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -6 0 -7 3 -10 6 -6 4 3 13 -1 21 -9 9 -8 22 -13 29 -10 8 3 14 1 14 -5 0 -6 7 -9 15 -5 8 3 15 1 15 -5 0 -6 9 -8 20 -4 12 4 20 2 20 -5 0 -7 8 -10 20 -7 11 3 20 1 20 -5 0 -6 13 -8 30 -6 17 3 30 1 30 -4 0 -4 38 -8 85 -8 51 0 85 4 85 10 0 6 15 8 40 4 24 -4 40 -3 40 3 0 6 11 8 25 5 14 -2 25 0 25 6 0 6 9 8 20 5 12 -3 20 0 20 6 0 7 4 10 9 7 12 -8 71 14 71 26 0 5 5 6 10 3 6 -3 10 -1 10 5 0 6 5 8 10 5 6 -3 10 -1 10 5 0 6 5 8 10 5 6 -3 10 -1 10 5 0 6 5 8 10 5 6 -3 10 -1 10 5 0 6 4 9 10 5 5 -3 18 3 29 14 11 11 22 17 25 14 3 -3 8 2 12 11 3 9 10 14 14 11 5 -3 16 5 24 17 9 12 16 18 16 13 0 -5 23 13 50 40 28 27 50 55 50 62 0 7 9 17 20 23 11 6 20 15 20 20 0 6 9 19 20 30 11 11 20 27 20 35 0 8 5 15 12 15 6 0 9 3 5 6 -3 4 0 12 7 19 7 7 30 64 52 127 38 111 39 115 39 263 0 127 -3 162 -23 229 -86 299 -330 529 -625 592 -97 20 -284 18 -372 -6z" style="fill: rgb(1, 1, 1);"></path>
                    <path d="M935 5349 c-131 -21 -170 -30 -237 -54 -384 -138 -632 -450 -678 -851 -8 -70 -10 -435 -8 -1229 l3 -1130 22 -57 c33 -86 70 -145 132 -205 103 -101 222 -143 408 -143 l102 0 4 -627 c2 -544 5 -634 19 -673 31 -87 50 -130 59 -130 5 0 9 -6 9 -14 0 -8 8 -21 17 -28 10 -7 23 -22 28 -32 6 -10 14 -18 18 -17 4 1 19 -12 33 -29 14 -16 30 -28 35 -24 5 3 9 0 9 -6 0 -6 5 -8 10 -5 6 3 10 1 10 -6 0 -7 3 -10 6 -6 3 3 15 -4 26 -15 11 -11 26 -17 34 -14 8 3 14 2 14 -3 0 -14 88 -34 120 -28 17 4 30 2 30 -3 0 -6 189 -10 520 -10 331 0 520 4 520 10 0 5 13 7 30 3 33 -6 120 14 120 29 0 5 4 6 10 3 12 -7 70 22 70 36 0 6 5 7 10 4 6 -3 10 -1 10 5 0 6 4 9 9 6 5 -4 21 9 37 26 15 18 29 31 32 28 3 -3 10 4 16 15 6 11 19 26 29 33 22 17 48 67 78 152 l24 65 3 632 3 633 102 0 c186 0 305 42 408 143 62 60 99 119 132 205 l22 57 3 1130 c2 793 0 1160 -8 1229 -55 479 -408 836 -885 895 -105 13 -1441 13 -1520 0z" style="fill: rgb(1, 1, 1);"></path>
                    <path d="M5627 4490 c-65 -17 -112 -47 -169 -109 -66 -71 -88 -127 -88 -225 0 -113 23 -150 206 -336 l157 -160 -1066 0 -1067 0 0 -330 0 -330 1067 0 1066 0 -157 -160 c-183 -186 -206 -223 -206 -336 0 -100 22 -154 91 -229 77 -82 136 -109 239 -109 143 -1 122 -18 750 609 l555 555 -555 555 c-477 475 -563 558 -611 579 -63 29 -155 40 -212 26z" style="fill: rgb(1, 1, 1);"></path>
                </g>
             </svg>
        `).appendTo(shapeContainer);
    }

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.id = "entry";
        const componentsID = {
            rectID: Utils.getGuid(),
            headerLineID: Utils.getGuid(),
            textHeaderID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg  viewBox="369 -38 355 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g transform="matrix(1.453345, 0, 0, 1.576864, -353.899658, -122.17749)" style="">
                    <rect id="${componentsID.rectID}" class="shape-hover" x="497.748" y="53.256" width="243.576" height="317.085" style="fill: rgb(250, 250, 250); stroke: #DEDEDE;"></rect>
                    <line id="${componentsID.headerLineID}" style="fill: rgb(216, 216, 216); stroke: #DEDEDE;" x1="499" y1="100" x2="740" y2="100"></line>
                    <text id="${componentsID.textHeaderID}" style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 30px;" x="620" y="90">Sender</text>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });
    }

    private _shape: DevExpress.ui.TCustomShape = {
        type: "sender",
        title: "Sender",
        category: "Process",
        defaultHeight: 2,
        defaultWidth: 1.5,
        allowResize: false,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class ReciverCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.072066, 0, 0, -0.06747, -6.869216, 498.174377)" fill="#000000" stroke="none">
                    <path d="M5145 7335 c-293 -68 -532 -296 -617 -591 -20 -67 -23 -102 -23 -229 0 -148 1 -152 39 -263 22 -63 45 -120 52 -127 7 -7 10 -15 7 -19 -4 -3 -1 -6 5 -6 7 0 12 -7 12 -15 0 -8 9 -24 20 -35 11 -11 20 -24 20 -30 0 -5 9 -14 20 -20 11 -6 20 -16 20 -23 0 -7 23 -35 50 -62 28 -27 50 -45 50 -40 0 5 7 -1 16 -13 8 -12 19 -20 24 -17 4 3 11 -2 14 -11 4 -9 9 -14 12 -11 3 3 14 -3 25 -14 11 -11 24 -17 29 -14 6 4 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 1 10 -5 0 -6 5 -8 10 -5 6 3 10 2 10 -3 0 -12 59 -34 71 -26 5 3 9 0 9 -7 0 -6 8 -9 20 -6 11 3 20 1 20 -5 0 -6 11 -8 25 -6 14 3 25 1 25 -5 0 -6 16 -7 40 -3 25 4 40 2 40 -4 0 -6 34 -10 85 -10 47 0 85 4 85 8 0 5 14 7 30 4 17 -2 30 0 30 6 0 6 9 8 20 5 12 -3 20 0 20 7 0 7 8 9 20 5 11 -4 20 -2 20 4 0 6 7 8 15 5 8 -4 15 -1 15 5 0 6 6 8 14 5 7 -3 20 2 29 10 8 8 17 12 21 9 3 -4 6 -1 6 6 0 7 5 9 10 6 6 -3 10 -1 10 5 0 6 5 8 10 5 6 -3 10 -1 10 5 0 6 5 8 10 5 6 -3 10 -1 10 5 0 6 4 9 10 5 5 -3 18 3 29 14 11 11 22 17 25 14 3 -3 8 2 12 11 3 9 10 14 15 11 4 -3 16 6 25 20 9 13 20 23 24 20 6 -4 33 23 126 126 8 9 14 21 14 27 0 7 4 12 10 12 5 0 12 11 16 25 3 14 9 25 13 25 19 0 80 169 101 278 19 92 8 289 -20 377 -85 270 -280 471 -540 557 -86 28 -109 32 -240 34 -98 2 -165 -1 -205 -11z" style="fill: rgb(3, 3, 3);"></path>
                    <path d="M4545 5349 c-467 -60 -821 -422 -875 -895 -8 -69 -10 -436 -8 -1229 l3 -1130 22 -57 c33 -86 70 -145 132 -205 103 -101 222 -143 408 -143 l102 0 3 -633 3 -632 24 -65 c30 -85 56 -135 78 -152 10 -7 23 -22 28 -32 6 -10 15 -19 20 -20 6 0 21 -13 33 -28 13 -16 28 -26 33 -22 5 3 9 0 9 -6 0 -6 5 -8 10 -5 6 3 10 2 10 -4 0 -14 58 -43 70 -36 6 3 10 2 10 -3 0 -15 87 -35 120 -29 17 4 30 2 30 -3 0 -6 189 -10 520 -10 331 0 520 4 520 10 0 5 13 7 30 3 32 -6 120 14 120 28 0 5 6 6 14 3 8 -3 23 3 34 14 11 11 23 18 26 15 3 -4 6 -1 6 6 0 7 5 9 10 6 6 -3 10 -1 10 5 0 6 4 9 9 6 5 -4 20 6 33 22 12 15 27 27 32 27 5 0 14 9 20 20 6 11 19 26 29 33 9 7 17 20 17 28 0 8 4 14 9 14 9 0 28 43 59 130 14 39 17 129 19 672 l4 628 102 0 c186 0 305 42 408 143 62 60 99 119 132 205 l22 57 3 1130 c2 794 0 1159 -8 1229 -53 462 -363 791 -845 897 -72 16 -1484 23 -1600 8z" style="fill: rgb(3, 3, 3);"></path>
                    <path d="M2157 4490 c-65 -17 -112 -47 -169 -109 -66 -71 -88 -127 -88 -225 0 -113 23 -150 206 -336 l157 -160 -1066 0 -1067 0 0 -330 0 -330 1067 0 1066 0 -157 -160 c-183 -186 -206 -223 -206 -336 0 -100 22 -154 91 -229 77 -82 136 -109 239 -109 143 -1 122 -18 750 609 l555 555 -555 555 c-477 475 -563 558 -611 579 -63 29 -155 40 -212 26z" style="fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer)
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.id = "entry";
        const componentsID = {
            rectID: Utils.getGuid(),
            headerLineID: Utils.getGuid(),
            textHeaderID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`<svg  viewBox="369 -38 355 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <g transform="matrix(1.453345, 0, 0, 1.576864, -353.899658, -122.17749)" style="">
                    <rect id="${componentsID.rectID}" class="shape-hover" x="497.748" y="53.256" width="243.576" height="317.085" style="fill: rgb(250, 250, 250); stroke: #DEDEDE;"></rect>
                    <line id="${componentsID.headerLineID}" style="fill: rgb(216, 216, 216); stroke: #DEDEDE;" x1="499" y1="100" x2="740" y2="100"></line>
                    <text id="${componentsID.textHeaderID}" style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 30px;" x="620" y="90">Reciver</text>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "reciver",
        title: "Reciver",
        category: "Process",
        defaultHeight: 2,
        defaultWidth: 1.5,
        allowResize: false,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class ProcessContainerCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();

        let icon = $(`
            <svg x="${(Number((container.position as any)["x"]) * 100).toFixed(0)}" y="${(Number((container.position as any)["y"]) * 50).toFixed(0)}" width="400" height="400" viewBox="0 0 8500 8500" xmlns="http://www.w3.org/2000/svg">
                <path d="M 88.638 501 C 39.684 501 -0.001 461.318 -0.001 412.366 C -0.001 363.414 39.684 323.731 88.638 323.731 C 128.779 323.731 162.689 350.423 173.605 387.042 L 316.567 387.042 L 316.567 336.393 L 367.218 336.393 L 367.218 190.577 L 310.413 133.8 L 164.614 133.8 L 164.614 184.448 L 12.662 184.448 L 12.662 32.503 L 164.614 32.503 L 164.614 83.152 L 310.413 83.152 L 392.543 1 L 499.999 108.476 L 417.868 190.552 L 417.868 336.393 L 468.519 336.393 L 468.519 488.338 L 316.567 488.338 L 316.567 437.69 L 173.605 437.69 C 162.715 474.309 128.779 501 88.638 501 Z M 88.638 374.38 C 67.669 374.38 50.65 391.397 50.65 412.366 C 50.65 433.334 67.669 450.352 88.638 450.352 C 109.607 450.352 126.626 433.334 126.626 412.366 C 126.626 391.397 109.607 374.38 88.638 374.38 Z M 417.868 387.042 L 367.218 387.042 L 367.218 437.69 L 417.868 437.69 L 417.868 387.042 Z M 392.543 72.668 L 356.733 108.476 L 392.543 144.284 L 428.353 108.476 L 392.543 72.668 Z M 113.963 83.152 L 63.313 83.152 L 63.313 133.8 L 113.963 133.8 L 113.963 83.152 Z" style="fill: rgb(3, 3, 3);"></path>
            </svg>
        `);
        icon.appendTo(parentElement);
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "processContainer");
        parentElement.children().remove();
        parentElement.append(shapeContainer);

        const componentsID = {
            textHeaderID: Utils.getGuid(),
            rectID: Utils.getGuid(),
            headerLineID: Utils.getGuid(),
            iconID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        let rect = Utils.getNewSVGComponent("rect");
        rect.attr({
            "id": componentsID.rectID,
            "width": "100%",
            "height": "100%",
            "style": `
                fill: rgb(250, 250, 250);
                stroke: rgb(222, 222, 222);
            `
        });
        rect.appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });;

        let headerLine = Utils.getNewSVGComponent("line");
        headerLine.attr({
            "id": "headerLineID",
            "x1": "1",
            "y1": "35",
            "x2": "99.87%",
            "y2": "35",
            "style": `
                stroke: #DEDEDE
            `
        });
        headerLine.appendTo(shapeContainer);

        let textHeader = Utils.getNewSVGComponent("text");
        textHeader.attr({
            "id": componentsID.textHeaderID,
            "x": "50%",
            "y": "25",
            "style": `
                font-size: 20px;
                font-family: Arial, sans-serif;
            `
        });
        textHeader.text("Process")
        textHeader.appendTo(shapeContainer);

        let icon = $(`
            <svg id="${componentsID.iconID}" width="450" height="450" viewBox="-70 -70 8500 8500" xmlns="http://www.w3.org/2000/svg">
                <path d="M 88.638 501 C 39.684 501 -0.001 461.318 -0.001 412.366 C -0.001 363.414 39.684 323.731 88.638 323.731 C 128.779 323.731 162.689 350.423 173.605 387.042 L 316.567 387.042 L 316.567 336.393 L 367.218 336.393 L 367.218 190.577 L 310.413 133.8 L 164.614 133.8 L 164.614 184.448 L 12.662 184.448 L 12.662 32.503 L 164.614 32.503 L 164.614 83.152 L 310.413 83.152 L 392.543 1 L 499.999 108.476 L 417.868 190.552 L 417.868 336.393 L 468.519 336.393 L 468.519 488.338 L 316.567 488.338 L 316.567 437.69 L 173.605 437.69 C 162.715 474.309 128.779 501 88.638 501 Z M 88.638 374.38 C 67.669 374.38 50.65 391.397 50.65 412.366 C 50.65 433.334 67.669 450.352 88.638 450.352 C 109.607 450.352 126.626 433.334 126.626 412.366 C 126.626 391.397 109.607 374.38 88.638 374.38 Z M 417.868 387.042 L 367.218 387.042 L 367.218 437.69 L 417.868 437.69 L 417.868 387.042 Z M 392.543 72.668 L 356.733 108.476 L 392.543 144.284 L 428.353 108.476 L 392.543 72.668 Z M 113.963 83.152 L 63.313 83.152 L 63.313 133.8 L 113.963 133.8 L 113.963 83.152 Z" style="fill: rgb(3, 3, 3);"></path>
            </svg>
        `);
        icon.appendTo(shapeContainer);
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "processContainer",
        title: "Process Container",
        baseType: "verticalContainer",
        category: "Process",
        defaultHeight: 5,
        defaultWidth: 10,
        minHeight: 3.5,
        minWidth: 7,
        defaultText: "",
        toolboxTemplate: this.toolboxTemplate,
        template: this.template,
        connectionPoints: [{ x: 0, y: 0 }]
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class StartProcessCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.078574, 0, 0, 1.203558, -162.934113, -32.48341)">
                    <path d="M 181.197 155.358 L 320.269 155.358 L 320.269 72.271 L 181.197 72.271 L 181.197 155.358 Z M 189.377 80.797 L 189.377 78.663 L 312.088 78.663 L 312.088 80.797 L 250.733 122.366 L 189.377 80.797 Z M 312.088 89.259 L 312.088 143.049 L 286.654 118.212 L 280.258 122.2 L 307.663 148.967 L 193.804 148.967 L 221.21 122.2 L 214.811 118.212 L 189.377 143.049 L 189.377 89.259 L 250.733 130.828 L 312.088 89.259 Z" fill-rule="evenodd" style="stroke: rgb(0, 0, 0); fill-opacity: 0.99; fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer);
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "start_process");
        const componentsID = {
            ellipseID: Utils.getGuid(),
            pathID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.078574, 0, 0, 1.203558, -162.934113, -32.48341)">
                    <path d="M 181.197 155.358 L 320.269 155.358 L 320.269 72.271 L 181.197 72.271 L 181.197 155.358 Z M 189.377 80.797 L 189.377 78.663 L 312.088 78.663 L 312.088 80.797 L 250.733 122.366 L 189.377 80.797 Z M 312.088 89.259 L 312.088 143.049 L 286.654 118.212 L 280.258 122.2 L 307.663 148.967 L 193.804 148.967 L 221.21 122.2 L 214.811 118.212 L 189.377 143.049 L 189.377 89.259 L 250.733 130.828 L 312.088 89.259 Z" fill-rule="evenodd" style="stroke: rgb(0, 0, 0); fill-opacity: 0.99; fill: rgb(3, 3, 3);"></path>
                    <ellipse id="${componentsID.ellipseID}" style="fill: none; stroke: rgb(222, 222, 222); stroke-width: 8.76373px;" cx="250.733" cy="116.308" rx="92.715" ry="83.087"></ellipse>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "startProcess",
        title: "Start Process",
        category: "Process",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class EndProcessCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.078574, 0, 0, 1.203558, -162.934113, -32.48341)">
                    <path d="M 320.269 86.211 L 320.269 153.531 L 286.648 120.698 L 280.259 124.693 L 314.207 157.851 L 187.257 157.851 L 221.206 124.693 L 214.817 120.698 L 181.196 153.53 L 181.196 86.211 L 250.728 133.321 L 320.269 86.211 Z M 320.264 74.764 L 320.264 77.742 L 250.731 124.853 L 181.199 77.742 L 181.199 74.764 L 320.264 74.764 Z" fill-rule="evenodd" style="fill: rgb(6, 6, 6);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer);
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "end_process");
        const componentsID = {
            pathID: Utils.getGuid(),
            ellipseID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.078574, 0, 0, 1.203558, -162.934113, -32.48341)">
                    <path id="${componentsID.pathID}" d="M 320.269 86.211 L 320.269 153.531 L 286.648 120.698 L 280.259 124.693 L 314.207 157.851 L 187.257 157.851 L 221.206 124.693 L 214.817 120.698 L 181.196 153.53 L 181.196 86.211 L 250.728 133.321 L 320.269 86.211 Z M 320.264 74.764 L 320.264 77.742 L 250.731 124.853 L 181.199 77.742 L 181.199 74.764 L 320.264 74.764 Z" fill-rule="evenodd" style="fill: rgb(6, 6, 6);"></path>
                    <ellipse id="${componentsID.ellipseID}" style="fill: none; stroke: rgb(222, 222, 222); stroke-width: 8.76373px;" cx="250.733" cy="116.308" rx="92.715" ry="83.087"></ellipse>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "endProcess",
        title: "End Process",
        category: "Process",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class MulticastInCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.1, 0, 0, -0.1, -39.025749, 524.191956)" fill="#000000" stroke="none">
                    <path d="M 3868.298 4134.761 C 3799.728 4116.144 3748.565 4053.794 3752.784 3994.041 C 3753.839 3980.618 3756.477 3969.794 3759.114 3969.794 C 3761.225 3969.794 3762.279 3966.762 3760.168 3963.299 C 3758.586 3959.835 3759.642 3956.804 3762.805 3956.804 C 3765.971 3956.804 3767.026 3953.341 3765.443 3949.011 C 3762.805 3943.383 3787.069 3921.3 3859.333 3862.413 C 3912.606 3819.114 3958.495 3783.61 3961.132 3783.61 C 3966.934 3783.61 4086.141 3675.796 4090.36 3666.703 C 4092.998 3660.641 4062.405 3659.775 3815.551 3659.342 L 3538.106 3658.91 L 3474.812 3647.219 C 3146.73 3586.167 2896.712 3386.562 2813.371 3118.976 C 2795.966 3063.12 2792.273 3035.409 2783.835 2887.328 C 2779.087 2805.493 2772.23 2732.319 2767.483 2712.835 C 2750.076 2640.958 2692.583 2554.794 2624.012 2499.373 C 2528.014 2421.435 2386.126 2372.074 2256.898 2372.074 L 2212.063 2372.074 L 2190.964 2408.445 C 2126.088 2522.753 2019.013 2599.825 1871.323 2640.093 C 1639.24 2702.877 1374.452 2611.083 1259.992 2428.361 C 1180.346 2301.497 1180.346 2165.54 1259.992 2038.673 C 1374.452 1855.954 1639.24 1764.16 1871.323 1826.944 C 2015.321 1865.912 2119.231 1939.954 2186.219 2050.364 L 2214.175 2096.262 L 2274.832 2093.664 C 2377.16 2089.334 2460.498 2066.817 2544.893 2020.49 C 2630.342 1973.294 2700.494 1903.15 2740.055 1826.079 C 2770.648 1765.46 2775.394 1739.481 2781.198 1588.368 C 2784.361 1513.028 2789.635 1436.391 2793.857 1417.339 C 2847.131 1167.073 3063.917 951.879 3351.911 864.849 C 3399.911 850.56 3483.25 832.374 3522.283 828.478 C 3537.052 826.745 3672.083 825.014 3822.937 825.014 C 4094.581 824.147 4097.218 824.147 4098.801 815.487 C 4099.855 808.559 4061.351 775.22 3944.254 681.694 C 3856.695 611.551 3782.322 548.335 3774.411 537.51 C 3755.949 511.531 3751.73 468.665 3764.916 436.192 C 3772.301 418.872 3782.85 405.883 3806.586 386.397 C 3847.2 353.058 3886.233 339.636 3933.706 342.234 C 3999.111 345.697 3994.363 342.667 4339.85 618.045 C 4513.914 757.034 4662.658 877.838 4670.043 886.498 C 4691.667 910.312 4703.273 943.651 4699.58 971.363 C 4693.779 1016.826 4685.339 1025.054 4408.421 1245.876 C 3964.824 1599.626 4003.857 1573.214 3925.793 1572.781 C 3890.451 1572.781 3875.683 1570.617 3855.639 1562.822 C 3804.476 1542.905 3769.663 1506.967 3757.004 1460.637 C 3750.673 1438.122 3759.642 1399.587 3775.992 1377.071 C 3780.74 1370.576 3856.167 1307.793 3943.198 1237.216 C 4042.361 1157.115 4100.382 1106.887 4098.801 1102.992 C 4096.69 1097.794 4057.131 1096.929 3840.871 1095.629 C 3700.565 1095.196 3580.831 1096.064 3575.029 1098.228 C 3569.227 1100.393 3543.382 1106.455 3517.009 1111.651 C 3377.231 1138.928 3253.803 1218.598 3179.959 1329.009 C 3138.289 1391.36 3118.774 1463.668 3118.774 1555.894 C 3118.245 1655.049 3109.28 1764.595 3098.202 1804.862 C 3074.993 1888.428 3020.138 1993.643 2968.446 2054.695 C 2955.261 2069.85 2944.711 2085.004 2944.711 2088.468 C 2944.711 2094.097 2971.084 2094.962 3128.268 2094.962 C 3229.014 2094.962 3487.47 2096.262 3703.202 2097.994 C 4068.208 2100.592 4094.581 2100.159 4094.581 2093.231 C 4094.581 2089.334 4041.835 2043.87 3977.483 1992.345 C 3782.322 1836.037 3778.628 1833.439 3763.86 1806.594 C 3727.994 1741.647 3765.971 1665.007 3851.42 1632.101 C 3875.156 1623.008 3888.87 1620.842 3920.518 1620.842 C 3992.78 1620.842 3980.649 1613.05 4334.577 1895.788 C 4508.639 2034.345 4657.911 2155.58 4666.351 2165.106 C 4674.791 2174.633 4685.867 2194.983 4691.142 2210.137 C 4699.054 2233.951 4699.58 2240.013 4693.251 2259.497 C 4689.56 2271.188 4680.065 2289.806 4672.681 2300.198 C 4661.604 2315.786 4358.312 2561.722 4078.757 2781.679 C 4002.274 2841.863 3981.703 2850.524 3920.518 2850.091 C 3885.177 2850.091 3870.409 2847.927 3850.366 2840.133 C 3799.202 2820.214 3764.388 2784.277 3751.73 2737.946 C 3745.4 2715.433 3754.367 2676.897 3770.717 2654.381 C 3775.466 2647.886 3850.366 2585.103 3937.924 2514.527 C 4036.032 2434.856 4095.107 2384.198 4093.525 2380.301 C 4091.416 2375.105 4008.076 2374.239 3518.063 2372.94 C 2947.349 2372.074 2944.711 2372.074 2944.711 2380.733 C 2944.711 2385.496 2946.821 2389.393 2949.457 2389.393 C 2966.864 2389.393 3076.577 2563.454 3076.577 2591.164 C 3076.577 2594.196 3079.214 2601.99 3082.906 2608.918 C 3098.202 2639.227 3108.225 2695.082 3113.498 2774.751 C 3116.663 2821.081 3120.884 2894.256 3123.521 2937.121 C 3126.685 2980.852 3132.488 3025.883 3136.707 3040.172 C 3141.453 3054.027 3145.147 3069.182 3145.147 3073.945 C 3145.147 3078.274 3147.258 3085.636 3150.421 3089.965 C 3153.059 3093.862 3163.08 3112.048 3173.102 3130.232 C 3221.102 3218.562 3296.529 3284.377 3408.88 3336.335 C 3439.998 3351.056 3498.549 3367.942 3547.601 3376.602 C 3563.953 3379.633 3577.667 3383.964 3577.667 3386.128 C 3577.667 3390.891 4084.558 3390.459 4094.053 3385.694 C 4099.855 3382.664 4100.382 3379.2 4096.69 3373.138 C 4094.053 3368.375 4025.483 3311.654 3944.78 3247.139 C 3864.079 3183.058 3791.29 3122.006 3783.379 3112.048 C 3728.52 3044.935 3762.279 2957.038 3856.167 2918.936 C 3881.485 2908.545 3892.562 2906.812 3928.429 2907.245 C 3970.627 2907.245 3988.56 2911.575 4033.923 2933.657 C 4054.492 2943.615 4678.482 3453.241 4687.449 3467.529 C 4704.855 3494.808 4702.219 3543.734 4681.119 3579.24 C 4676.373 3587.467 4525.518 3713.466 4346.181 3859.815 C 4054.492 4097.093 4016.515 4126.535 3992.252 4133.463 C 3957.44 4144.287 3905.22 4144.721 3868.298 4134.761 Z M 1787.983 2371.641 C 1825.433 2359.949 1863.938 2330.94 1881.872 2301.064 C 1905.08 2261.662 1904.552 2201.477 1880.817 2162.508 C 1867.63 2141.725 1830.709 2111.85 1802.754 2100.159 C 1767.413 2085.437 1698.314 2081.541 1658.227 2092.797 C 1559.592 2119.643 1510.537 2216.632 1554.846 2297.167 C 1571.723 2328.342 1611.81 2359.949 1647.678 2371.208 C 1687.237 2383.765 1747.369 2383.765 1787.983 2371.641 Z" style="fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer);
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "multicast_in");
        const componentsID = {
            rectID: Utils.getGuid(),
            pathID: Utils.getGuid()
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.1, 0, 0, -0.1, -39.025749, 524.191956)" fill="#000000" stroke="none">
                    <rect id="${componentsID.rectID}" x="4266.317" y="-4395.41" width="4190.001" height="4149.599" style="fill: none; stroke: #DEDEDE; stroke-width: 150px; stroke-miterlimit: 10.67; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.707107, -0.707107, -0.707107, -0.707107, -2971.057751, 4562.530347)"></rect>
                    <path id="${componentsID.pathID}" d="M 3868.298 4134.761 C 3799.728 4116.144 3748.565 4053.794 3752.784 3994.041 C 3753.839 3980.618 3756.477 3969.794 3759.114 3969.794 C 3761.225 3969.794 3762.279 3966.762 3760.168 3963.299 C 3758.586 3959.835 3759.642 3956.804 3762.805 3956.804 C 3765.971 3956.804 3767.026 3953.341 3765.443 3949.011 C 3762.805 3943.383 3787.069 3921.3 3859.333 3862.413 C 3912.606 3819.114 3958.495 3783.61 3961.132 3783.61 C 3966.934 3783.61 4086.141 3675.796 4090.36 3666.703 C 4092.998 3660.641 4062.405 3659.775 3815.551 3659.342 L 3538.106 3658.91 L 3474.812 3647.219 C 3146.73 3586.167 2896.712 3386.562 2813.371 3118.976 C 2795.966 3063.12 2792.273 3035.409 2783.835 2887.328 C 2779.087 2805.493 2772.23 2732.319 2767.483 2712.835 C 2750.076 2640.958 2692.583 2554.794 2624.012 2499.373 C 2528.014 2421.435 2386.126 2372.074 2256.898 2372.074 L 2212.063 2372.074 L 2190.964 2408.445 C 2126.088 2522.753 2019.013 2599.825 1871.323 2640.093 C 1639.24 2702.877 1374.452 2611.083 1259.992 2428.361 C 1180.346 2301.497 1180.346 2165.54 1259.992 2038.673 C 1374.452 1855.954 1639.24 1764.16 1871.323 1826.944 C 2015.321 1865.912 2119.231 1939.954 2186.219 2050.364 L 2214.175 2096.262 L 2274.832 2093.664 C 2377.16 2089.334 2460.498 2066.817 2544.893 2020.49 C 2630.342 1973.294 2700.494 1903.15 2740.055 1826.079 C 2770.648 1765.46 2775.394 1739.481 2781.198 1588.368 C 2784.361 1513.028 2789.635 1436.391 2793.857 1417.339 C 2847.131 1167.073 3063.917 951.879 3351.911 864.849 C 3399.911 850.56 3483.25 832.374 3522.283 828.478 C 3537.052 826.745 3672.083 825.014 3822.937 825.014 C 4094.581 824.147 4097.218 824.147 4098.801 815.487 C 4099.855 808.559 4061.351 775.22 3944.254 681.694 C 3856.695 611.551 3782.322 548.335 3774.411 537.51 C 3755.949 511.531 3751.73 468.665 3764.916 436.192 C 3772.301 418.872 3782.85 405.883 3806.586 386.397 C 3847.2 353.058 3886.233 339.636 3933.706 342.234 C 3999.111 345.697 3994.363 342.667 4339.85 618.045 C 4513.914 757.034 4662.658 877.838 4670.043 886.498 C 4691.667 910.312 4703.273 943.651 4699.58 971.363 C 4693.779 1016.826 4685.339 1025.054 4408.421 1245.876 C 3964.824 1599.626 4003.857 1573.214 3925.793 1572.781 C 3890.451 1572.781 3875.683 1570.617 3855.639 1562.822 C 3804.476 1542.905 3769.663 1506.967 3757.004 1460.637 C 3750.673 1438.122 3759.642 1399.587 3775.992 1377.071 C 3780.74 1370.576 3856.167 1307.793 3943.198 1237.216 C 4042.361 1157.115 4100.382 1106.887 4098.801 1102.992 C 4096.69 1097.794 4057.131 1096.929 3840.871 1095.629 C 3700.565 1095.196 3580.831 1096.064 3575.029 1098.228 C 3569.227 1100.393 3543.382 1106.455 3517.009 1111.651 C 3377.231 1138.928 3253.803 1218.598 3179.959 1329.009 C 3138.289 1391.36 3118.774 1463.668 3118.774 1555.894 C 3118.245 1655.049 3109.28 1764.595 3098.202 1804.862 C 3074.993 1888.428 3020.138 1993.643 2968.446 2054.695 C 2955.261 2069.85 2944.711 2085.004 2944.711 2088.468 C 2944.711 2094.097 2971.084 2094.962 3128.268 2094.962 C 3229.014 2094.962 3487.47 2096.262 3703.202 2097.994 C 4068.208 2100.592 4094.581 2100.159 4094.581 2093.231 C 4094.581 2089.334 4041.835 2043.87 3977.483 1992.345 C 3782.322 1836.037 3778.628 1833.439 3763.86 1806.594 C 3727.994 1741.647 3765.971 1665.007 3851.42 1632.101 C 3875.156 1623.008 3888.87 1620.842 3920.518 1620.842 C 3992.78 1620.842 3980.649 1613.05 4334.577 1895.788 C 4508.639 2034.345 4657.911 2155.58 4666.351 2165.106 C 4674.791 2174.633 4685.867 2194.983 4691.142 2210.137 C 4699.054 2233.951 4699.58 2240.013 4693.251 2259.497 C 4689.56 2271.188 4680.065 2289.806 4672.681 2300.198 C 4661.604 2315.786 4358.312 2561.722 4078.757 2781.679 C 4002.274 2841.863 3981.703 2850.524 3920.518 2850.091 C 3885.177 2850.091 3870.409 2847.927 3850.366 2840.133 C 3799.202 2820.214 3764.388 2784.277 3751.73 2737.946 C 3745.4 2715.433 3754.367 2676.897 3770.717 2654.381 C 3775.466 2647.886 3850.366 2585.103 3937.924 2514.527 C 4036.032 2434.856 4095.107 2384.198 4093.525 2380.301 C 4091.416 2375.105 4008.076 2374.239 3518.063 2372.94 C 2947.349 2372.074 2944.711 2372.074 2944.711 2380.733 C 2944.711 2385.496 2946.821 2389.393 2949.457 2389.393 C 2966.864 2389.393 3076.577 2563.454 3076.577 2591.164 C 3076.577 2594.196 3079.214 2601.99 3082.906 2608.918 C 3098.202 2639.227 3108.225 2695.082 3113.498 2774.751 C 3116.663 2821.081 3120.884 2894.256 3123.521 2937.121 C 3126.685 2980.852 3132.488 3025.883 3136.707 3040.172 C 3141.453 3054.027 3145.147 3069.182 3145.147 3073.945 C 3145.147 3078.274 3147.258 3085.636 3150.421 3089.965 C 3153.059 3093.862 3163.08 3112.048 3173.102 3130.232 C 3221.102 3218.562 3296.529 3284.377 3408.88 3336.335 C 3439.998 3351.056 3498.549 3367.942 3547.601 3376.602 C 3563.953 3379.633 3577.667 3383.964 3577.667 3386.128 C 3577.667 3390.891 4084.558 3390.459 4094.053 3385.694 C 4099.855 3382.664 4100.382 3379.2 4096.69 3373.138 C 4094.053 3368.375 4025.483 3311.654 3944.78 3247.139 C 3864.079 3183.058 3791.29 3122.006 3783.379 3112.048 C 3728.52 3044.935 3762.279 2957.038 3856.167 2918.936 C 3881.485 2908.545 3892.562 2906.812 3928.429 2907.245 C 3970.627 2907.245 3988.56 2911.575 4033.923 2933.657 C 4054.492 2943.615 4678.482 3453.241 4687.449 3467.529 C 4704.855 3494.808 4702.219 3543.734 4681.119 3579.24 C 4676.373 3587.467 4525.518 3713.466 4346.181 3859.815 C 4054.492 4097.093 4016.515 4126.535 3992.252 4133.463 C 3957.44 4144.287 3905.22 4144.721 3868.298 4134.761 Z M 1787.983 2371.641 C 1825.433 2359.949 1863.938 2330.94 1881.872 2301.064 C 1905.08 2261.662 1904.552 2201.477 1880.817 2162.508 C 1867.63 2141.725 1830.709 2111.85 1802.754 2100.159 C 1767.413 2085.437 1698.314 2081.541 1658.227 2092.797 C 1559.592 2119.643 1510.537 2216.632 1554.846 2297.167 C 1571.723 2328.342 1611.81 2359.949 1647.678 2371.208 C 1687.237 2383.765 1747.369 2383.765 1787.983 2371.641 Z" style="fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "multicastIn",
        title: "Multicast In",
        category: "Process",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class MulticastOutCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        shapeContainer.appendTo(parentElement);

        $(`
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.1, 0, 0, -0.1, -39.025749, 524.191956)" fill="#000000" stroke="none">
                    <path d="M 2707.902 3987.933 C 2538.711 3971.545 2383.226 3881.19 2305.22 3753.629 C 2275.174 3704.465 2257.781 3657.073 2246.713 3593.291 C 2238.28 3542.8 2238.28 3540.142 2248.822 3493.636 C 2255.146 3467.06 2265.689 3431.184 2272.541 3413.467 C 2363.723 3188.021 2655.195 3061.788 2916.094 3133.985 C 3009.386 3160.118 3083.177 3199.537 3145.897 3256.674 C 3185.955 3293.437 3212.836 3327.983 3238.664 3375.82 L 3258.691 3413.025 L 3306.127 3411.252 C 3372.012 3409.038 3473.209 3385.12 3530.134 3358.103 C 3641.873 3305.395 3717.243 3237.628 3765.735 3147.273 C 3775.749 3128.671 3785.763 3110.068 3788.399 3106.082 C 3791.561 3101.652 3793.669 3094.123 3793.669 3089.693 C 3793.669 3084.821 3797.359 3069.319 3802.103 3055.146 C 3806.319 3040.528 3812.117 2994.466 3815.278 2949.731 C 3817.915 2905.882 3822.132 2831.029 3825.294 2783.636 C 3830.565 2702.14 3840.579 2645.003 3855.864 2613.999 C 3859.554 2606.912 3862.189 2598.94 3862.189 2595.839 C 3862.189 2567.492 3971.819 2389.439 3989.214 2389.439 C 3991.848 2389.439 3993.957 2385.453 3993.957 2380.581 C 3993.957 2371.721 3990.267 2371.721 3627.641 2371.721 L 3261.853 2371.721 L 3240.771 2408.926 C 3175.941 2525.857 3069.473 2604.697 2921.365 2645.889 C 2687.345 2710.998 2419.593 2616.656 2305.22 2429.302 C 2225.631 2299.527 2225.631 2160.45 2305.22 2030.674 C 2420.12 1842.877 2687.345 1748.978 2921.365 1814.087 C 3065.256 1853.949 3169.088 1929.689 3236.027 2041.748 L 3263.435 2088.254 L 3628.696 2088.254 C 3944.413 2088.254 3993.957 2087.368 3993.957 2081.611 C 3993.957 2078.066 3983.415 2062.565 3970.24 2047.061 C 3918.586 1984.611 3863.77 1876.982 3840.579 1791.498 C 3829.509 1750.307 3820.549 1638.249 3820.023 1536.82 C 3820.023 1467.725 3811.589 1420.333 3791.035 1368.068 C 3737.8 1233.421 3602.342 1125.348 3436.842 1085.043 C 3402.582 1076.628 3372.539 1072.642 3321.413 1070.869 L 3251.84 1068.211 L 3230.756 1106.303 C 3165.4 1223.677 3058.93 1302.515 2910.823 1343.707 C 2678.912 1407.931 2414.321 1314.032 2299.948 1127.12 C 2220.36 997.345 2220.36 858.268 2299.948 728.494 C 2388.496 583.658 2573.498 489.317 2763.244 491.974 C 2830.182 492.86 2871.821 499.503 2934.542 518.992 C 3063.148 559.298 3160.657 632.38 3222.85 736.023 L 3252.894 786.073 L 3314.035 786.073 C 3517.483 786.073 3743.07 867.57 3896.448 996.016 C 4025.581 1104.531 4114.129 1247.152 4144.698 1395.086 C 4148.916 1414.575 4154.187 1492.971 4157.349 1570.039 C 4163.147 1724.618 4167.891 1751.194 4198.462 1813.202 C 4251.168 1919.503 4358.162 2009.414 4484.66 2053.706 C 4550.018 2076.738 4602.726 2085.595 4672.299 2086.04 C 4716.044 2086.04 4731.857 2087.368 4731.857 2091.797 C 4731.857 2095.783 4776.132 2097.111 4934.78 2097.111 C 5112.93 2097.111 5137.703 2096.227 5137.703 2090.468 C 5137.703 2086.483 5084.994 2040.419 5020.692 1987.712 C 4825.677 1827.818 4821.986 1825.16 4807.229 1797.699 C 4771.387 1731.262 4809.337 1652.864 4894.722 1619.203 C 4918.44 1609.902 4932.144 1607.688 4963.768 1607.688 C 5035.978 1607.688 5023.855 1599.715 5377.52 1888.94 C 5551.454 2030.674 5700.615 2154.692 5709.048 2164.436 C 5717.481 2174.18 5728.55 2194.998 5733.82 2210.5 C 5741.726 2234.861 5742.254 2241.061 5735.929 2260.993 C 5732.24 2272.95 5722.753 2291.997 5715.373 2302.626 C 5704.304 2318.572 5401.238 2570.15 5121.89 2795.151 C 5045.464 2856.718 5024.909 2865.577 4963.768 2865.133 C 4928.456 2865.133 4913.696 2862.918 4893.668 2854.946 C 4842.542 2834.573 4807.755 2797.81 4795.107 2750.417 C 4788.781 2727.386 4797.741 2687.966 4814.08 2664.935 C 4818.825 2658.291 4893.668 2594.068 4981.161 2521.87 C 5079.196 2440.375 5138.23 2388.553 5136.647 2384.566 C 5134.538 2379.252 5092.901 2378.366 4871.003 2377.038 C 4576.898 2375.709 4570.045 2376.151 4484.66 2406.27 C 4358.162 2451.004 4251.168 2540.475 4198.462 2647.218 C 4169.471 2704.797 4163.674 2739.345 4154.714 2898.795 C 4146.28 3050.273 4142.591 3078.621 4125.198 3135.757 C 4052.988 3374.047 3846.376 3567.16 3574.936 3649.543 C 3525.391 3664.602 3415.231 3687.191 3390.987 3687.191 C 3383.08 3687.191 3377.282 3689.848 3377.282 3692.95 C 3377.282 3697.379 3364.632 3698.263 3317.196 3696.935 L 3257.11 3695.163 L 3236.027 3732.811 C 3196.498 3803.678 3147.479 3855.056 3075.27 3901.563 C 3005.17 3946.299 2908.715 3979.075 2821.221 3987.933 C 2768.515 3993.248 2764.299 3993.248 2707.902 3987.933 Z M 2832.817 3691.177 C 2870.238 3679.218 2908.715 3649.543 2926.635 3618.981 C 2949.827 3578.676 2949.3 3517.11 2925.581 3477.247 C 2912.405 3455.986 2875.51 3425.426 2847.575 3413.467 C 2812.261 3398.407 2743.214 3394.421 2703.159 3405.936 C 2604.595 3433.398 2555.577 3532.613 2599.851 3614.996 C 2616.718 3646.885 2656.775 3679.218 2692.617 3690.734 C 2732.146 3703.579 2792.233 3703.579 2832.817 3691.177 Z M 2838.088 2371.279 C 2875.51 2359.321 2913.986 2329.644 2931.906 2299.083 C 2955.097 2258.776 2954.571 2197.211 2930.853 2157.35 C 2917.676 2136.09 2880.78 2105.528 2852.847 2093.569 C 2817.533 2078.51 2748.485 2074.523 2708.428 2086.04 C 2609.867 2113.5 2560.848 2212.714 2605.122 2295.097 C 2621.989 2326.988 2662.046 2359.321 2697.887 2370.837 C 2737.418 2383.681 2797.503 2383.681 2838.088 2371.279 Z M 2827.546 1069.098 C 2864.969 1057.139 2903.444 1027.464 2921.365 996.902 C 2944.556 956.596 2944.029 895.031 2920.311 855.166 C 2907.135 833.908 2870.238 803.345 2842.305 791.387 C 2806.991 776.328 2737.944 772.343 2697.887 783.858 C 2599.325 811.318 2550.307 910.533 2594.582 992.916 C 2611.449 1024.807 2651.504 1057.139 2687.345 1068.655 C 2726.876 1081.5 2786.962 1081.5 2827.546 1069.098 Z" style="fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer);
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "multicast_out");
        const componentsID = {
            rectID: Utils.getGuid(),
            pathID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.1, 0, 0, -0.1, -39.025749, 524.191956)" fill="#000000" stroke="none">
                    <rect id="${componentsID.rectID}" x="4266.317" y="-4395.41" width="4190.001" height="4149.599" style="fill: none; stroke: #DEDEDE; stroke-width: 150px; stroke-miterlimit: 10.67; transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.707107, -0.707107, -0.707107, -0.707107, -2971.057751, 4562.530347)"></rect>
                    <path id="${componentsID.pathID}"  d="M 2707.902 3987.933 C 2538.711 3971.545 2383.226 3881.19 2305.22 3753.629 C 2275.174 3704.465 2257.781 3657.073 2246.713 3593.291 C 2238.28 3542.8 2238.28 3540.142 2248.822 3493.636 C 2255.146 3467.06 2265.689 3431.184 2272.541 3413.467 C 2363.723 3188.021 2655.195 3061.788 2916.094 3133.985 C 3009.386 3160.118 3083.177 3199.537 3145.897 3256.674 C 3185.955 3293.437 3212.836 3327.983 3238.664 3375.82 L 3258.691 3413.025 L 3306.127 3411.252 C 3372.012 3409.038 3473.209 3385.12 3530.134 3358.103 C 3641.873 3305.395 3717.243 3237.628 3765.735 3147.273 C 3775.749 3128.671 3785.763 3110.068 3788.399 3106.082 C 3791.561 3101.652 3793.669 3094.123 3793.669 3089.693 C 3793.669 3084.821 3797.359 3069.319 3802.103 3055.146 C 3806.319 3040.528 3812.117 2994.466 3815.278 2949.731 C 3817.915 2905.882 3822.132 2831.029 3825.294 2783.636 C 3830.565 2702.14 3840.579 2645.003 3855.864 2613.999 C 3859.554 2606.912 3862.189 2598.94 3862.189 2595.839 C 3862.189 2567.492 3971.819 2389.439 3989.214 2389.439 C 3991.848 2389.439 3993.957 2385.453 3993.957 2380.581 C 3993.957 2371.721 3990.267 2371.721 3627.641 2371.721 L 3261.853 2371.721 L 3240.771 2408.926 C 3175.941 2525.857 3069.473 2604.697 2921.365 2645.889 C 2687.345 2710.998 2419.593 2616.656 2305.22 2429.302 C 2225.631 2299.527 2225.631 2160.45 2305.22 2030.674 C 2420.12 1842.877 2687.345 1748.978 2921.365 1814.087 C 3065.256 1853.949 3169.088 1929.689 3236.027 2041.748 L 3263.435 2088.254 L 3628.696 2088.254 C 3944.413 2088.254 3993.957 2087.368 3993.957 2081.611 C 3993.957 2078.066 3983.415 2062.565 3970.24 2047.061 C 3918.586 1984.611 3863.77 1876.982 3840.579 1791.498 C 3829.509 1750.307 3820.549 1638.249 3820.023 1536.82 C 3820.023 1467.725 3811.589 1420.333 3791.035 1368.068 C 3737.8 1233.421 3602.342 1125.348 3436.842 1085.043 C 3402.582 1076.628 3372.539 1072.642 3321.413 1070.869 L 3251.84 1068.211 L 3230.756 1106.303 C 3165.4 1223.677 3058.93 1302.515 2910.823 1343.707 C 2678.912 1407.931 2414.321 1314.032 2299.948 1127.12 C 2220.36 997.345 2220.36 858.268 2299.948 728.494 C 2388.496 583.658 2573.498 489.317 2763.244 491.974 C 2830.182 492.86 2871.821 499.503 2934.542 518.992 C 3063.148 559.298 3160.657 632.38 3222.85 736.023 L 3252.894 786.073 L 3314.035 786.073 C 3517.483 786.073 3743.07 867.57 3896.448 996.016 C 4025.581 1104.531 4114.129 1247.152 4144.698 1395.086 C 4148.916 1414.575 4154.187 1492.971 4157.349 1570.039 C 4163.147 1724.618 4167.891 1751.194 4198.462 1813.202 C 4251.168 1919.503 4358.162 2009.414 4484.66 2053.706 C 4550.018 2076.738 4602.726 2085.595 4672.299 2086.04 C 4716.044 2086.04 4731.857 2087.368 4731.857 2091.797 C 4731.857 2095.783 4776.132 2097.111 4934.78 2097.111 C 5112.93 2097.111 5137.703 2096.227 5137.703 2090.468 C 5137.703 2086.483 5084.994 2040.419 5020.692 1987.712 C 4825.677 1827.818 4821.986 1825.16 4807.229 1797.699 C 4771.387 1731.262 4809.337 1652.864 4894.722 1619.203 C 4918.44 1609.902 4932.144 1607.688 4963.768 1607.688 C 5035.978 1607.688 5023.855 1599.715 5377.52 1888.94 C 5551.454 2030.674 5700.615 2154.692 5709.048 2164.436 C 5717.481 2174.18 5728.55 2194.998 5733.82 2210.5 C 5741.726 2234.861 5742.254 2241.061 5735.929 2260.993 C 5732.24 2272.95 5722.753 2291.997 5715.373 2302.626 C 5704.304 2318.572 5401.238 2570.15 5121.89 2795.151 C 5045.464 2856.718 5024.909 2865.577 4963.768 2865.133 C 4928.456 2865.133 4913.696 2862.918 4893.668 2854.946 C 4842.542 2834.573 4807.755 2797.81 4795.107 2750.417 C 4788.781 2727.386 4797.741 2687.966 4814.08 2664.935 C 4818.825 2658.291 4893.668 2594.068 4981.161 2521.87 C 5079.196 2440.375 5138.23 2388.553 5136.647 2384.566 C 5134.538 2379.252 5092.901 2378.366 4871.003 2377.038 C 4576.898 2375.709 4570.045 2376.151 4484.66 2406.27 C 4358.162 2451.004 4251.168 2540.475 4198.462 2647.218 C 4169.471 2704.797 4163.674 2739.345 4154.714 2898.795 C 4146.28 3050.273 4142.591 3078.621 4125.198 3135.757 C 4052.988 3374.047 3846.376 3567.16 3574.936 3649.543 C 3525.391 3664.602 3415.231 3687.191 3390.987 3687.191 C 3383.08 3687.191 3377.282 3689.848 3377.282 3692.95 C 3377.282 3697.379 3364.632 3698.263 3317.196 3696.935 L 3257.11 3695.163 L 3236.027 3732.811 C 3196.498 3803.678 3147.479 3855.056 3075.27 3901.563 C 3005.17 3946.299 2908.715 3979.075 2821.221 3987.933 C 2768.515 3993.248 2764.299 3993.248 2707.902 3987.933 Z M 2832.817 3691.177 C 2870.238 3679.218 2908.715 3649.543 2926.635 3618.981 C 2949.827 3578.676 2949.3 3517.11 2925.581 3477.247 C 2912.405 3455.986 2875.51 3425.426 2847.575 3413.467 C 2812.261 3398.407 2743.214 3394.421 2703.159 3405.936 C 2604.595 3433.398 2555.577 3532.613 2599.851 3614.996 C 2616.718 3646.885 2656.775 3679.218 2692.617 3690.734 C 2732.146 3703.579 2792.233 3703.579 2832.817 3691.177 Z M 2838.088 2371.279 C 2875.51 2359.321 2913.986 2329.644 2931.906 2299.083 C 2955.097 2258.776 2954.571 2197.211 2930.853 2157.35 C 2917.676 2136.09 2880.78 2105.528 2852.847 2093.569 C 2817.533 2078.51 2748.485 2074.523 2708.428 2086.04 C 2609.867 2113.5 2560.848 2212.714 2605.122 2295.097 C 2621.989 2326.988 2662.046 2359.321 2697.887 2370.837 C 2737.418 2383.681 2797.503 2383.681 2838.088 2371.279 Z M 2827.546 1069.098 C 2864.969 1057.139 2903.444 1027.464 2921.365 996.902 C 2944.556 956.596 2944.029 895.031 2920.311 855.166 C 2907.135 833.908 2870.238 803.345 2842.305 791.387 C 2806.991 776.328 2737.944 772.343 2697.887 783.858 C 2599.325 811.318 2550.307 910.533 2594.582 992.916 C 2611.449 1024.807 2651.504 1057.139 2687.345 1068.655 C 2726.876 1081.5 2786.962 1081.5 2827.546 1069.098 Z" style="fill: rgb(3, 3, 3);"></path>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "multicastOut",
        title: "Multicast Out",
        category: "Process",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class StartExceptionCustonShape {
    private toolboxTemplate = (container: any, data: any) => { };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "dx_custom_shape_start");
        const componentsID = {
            ellipseID: Utils.getGuid(),
            pathID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="310 -20 300 630" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(0.991667, 0, 0, 0.991667, 24.658199, 52.933258)">
                    <ellipse id="${componentsID.ellipseID}" style="stroke: #DEDEDE; fill: rgb(250, 250, 250); fill-rule: nonzero; transform-origin: 488.341px 12.113px; paint-order: fill; stroke-width: 30px;" cx="439" cy="244" rx="300" ry="300"></ellipse>
                </g>
                <path d="M 647.974 269.204 L 647.217 269.215 C 630.298 269.626 609.316 270.037 588.155 270.448 C 568.388 270.837 548.466 271.231 531.536 271.62 C 541.282 242.847 560.168 214.253 578.474 186.54 C 595.044 161.465 612.169 135.531 622.292 109.744 L 622.498 109.245 C 622.595 109.017 622.685 108.788 622.778 108.578 C 626.48 105.336 627.292 101.258 624.866 97.436 C 621.863 92.705 614.485 89.401 606.902 89.401 C 602.472 89.401 598.249 90.488 594.726 92.545 C 558.474 113.666 532.474 131.182 510.575 149.195 C 447.491 197.431 374.625 246.618 287.817 299.551 C 287.42 299.8 287.093 300.04 287.162 300.04 C 281.529 303.411 279.557 309.253 282.382 314.238 C 285.083 319.005 291.35 321.852 299.133 321.852 C 333.363 321.852 369.651 321.899 406.303 322.423 C 358.514 387.019 311.585 436.604 259.052 478.061 C 255.111 481.173 253.674 484.996 254.957 488.875 C 256.017 495.367 263.489 500.399 272.177 500.399 C 275.693 500.399 279.231 499.569 282.387 497.982 C 407.604 435.4 539.696 367.976 657.419 292.432 C 658.262 291.896 659.023 291.314 659.722 290.67 C 665.082 287.219 666.975 281.574 664.288 276.715 C 661.696 272.012 655.59 269.204 647.974 269.204 Z M 451.692 316.392 C 454.569 312.37 454.222 307.932 450.744 304.223 C 447.148 300.395 440.685 297.916 434.269 297.916 C 433.405 297.916 432.546 297.963 431.705 298.048 C 401.737 297.42 372.391 297.213 346.217 297.129 C 415.341 253.981 475.107 213.24 528.576 172.848 C 529.926 172.18 531.079 171.428 532.087 170.567 C 533.22 169.59 534.398 168.63 535.563 167.682 L 539.227 164.81 C 539.882 164.323 540.395 163.821 540.89 163.318 C 547.272 158.184 554.042 153.075 561.318 147.9 C 555.731 157.218 549.879 166.563 544.125 175.713 C 523.198 209.096 501.542 243.608 491.678 278.686 C 491.551 279.162 491.473 279.631 491.414 280.076 C 489.249 283.931 489.816 288.419 492.979 291.773 C 496.117 295.086 501.437 296.987 507.594 296.987 L 508.371 296.971 C 523.727 296.593 543.694 296.215 563.568 295.842 C 575.741 295.602 587.877 295.38 598.914 295.15 C 517.693 345.216 431.857 390.954 359.991 427.837 C 391.281 395.475 421.472 358.758 451.692 316.392 Z" style="fill: rgb(7, 7, 12);"></path>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "startException",
        title: "Start Exception",
        category: "Exception",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class DataConverterCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();

        $(`
            <svg width="800px" height="800px" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M11 16.15V18.85C11 21.1 10.1 22 7.85 22H5.15C2.9 22 2 21.1 2 18.85V16.15C2 13.9 2.9 13 5.15 13H7.85C10.1 13 11 13.9 11 16.15Z" fill="#292D32"/>
                <path opacity="0.4" d="M17.5 11C19.9853 11 22 8.98528 22 6.5C22 4.01472 19.9853 2 17.5 2C15.0147 2 13 4.01472 13 6.5C13 8.98528 15.0147 11 17.5 11Z" fill="#292D32"/>
                <path d="M14.7795 22C14.5095 22 14.2595 21.85 14.1295 21.62C13.9995 21.38 13.9995 21.1 14.1395 20.86L15.1095 19.24C15.3195 18.88 15.7795 18.77 16.1395 18.98C16.4995 19.19 16.6095 19.65 16.3995 20.01L16.2195 20.31C18.6895 19.67 20.5095 17.43 20.5095 14.77C20.5095 14.36 20.8495 14.02 21.2595 14.02C21.6695 14.02 21.9995 14.36 21.9995 14.78C21.9995 18.76 18.7595 22 14.7795 22Z" fill="#292D32"/>
                <path d="M2.75 9.97C2.34 9.97 2 9.64 2 9.22C2 5.24 5.24 2 9.22 2C9.5 2 9.74 2.15 9.88 2.38C10.01 2.62 10.01 2.9 9.87 3.14L8.9 4.75C8.68 5.11 8.22 5.23 7.87 5.01C7.51 4.8 7.4 4.34 7.61 3.98L7.79 3.68C5.33 4.32 3.5 6.56 3.5 9.22C3.5 9.64 3.16 9.97 2.75 9.97Z" fill="#292D32"/>
            </svg>
        `).appendTo(parentElement).attr({
            "x": (container.position as any).x * 100,
            "y": (container.position as any).y * 95,
        });
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "multicast_out");
        const componentsID = {
            rectID: Utils.getGuid(),
            iconID: Utils.getGuid(),
            textID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        let rect = Utils.getNewSVGComponent("rect");
        rect.attr({
            "id": componentsID.rectID,
            "width": "100%",
            "height": "100%",
            "rx": "5",
            "ry": "5",
            "style": `
                stroke: #DEDEDE;
                fill: rgb(250, 250, 250);
            `
        }).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });

        let icon = $(`
            <svg x="5" y="5" width="800px" height="800px" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M11 16.15V18.85C11 21.1 10.1 22 7.85 22H5.15C2.9 22 2 21.1 2 18.85V16.15C2 13.9 2.9 13 5.15 13H7.85C10.1 13 11 13.9 11 16.15Z" fill="#292D32"/>
                <path opacity="0.4" d="M17.5 11C19.9853 11 22 8.98528 22 6.5C22 4.01472 19.9853 2 17.5 2C15.0147 2 13 4.01472 13 6.5C13 8.98528 15.0147 11 17.5 11Z" fill="#292D32"/>
                <path d="M14.7795 22C14.5095 22 14.2595 21.85 14.1295 21.62C13.9995 21.38 13.9995 21.1 14.1395 20.86L15.1095 19.24C15.3195 18.88 15.7795 18.77 16.1395 18.98C16.4995 19.19 16.6095 19.65 16.3995 20.01L16.2195 20.31C18.6895 19.67 20.5095 17.43 20.5095 14.77C20.5095 14.36 20.8495 14.02 21.2595 14.02C21.6695 14.02 21.9995 14.36 21.9995 14.78C21.9995 18.76 18.7595 22 14.7795 22Z" fill="#292D32"/>
                <path d="M2.75 9.97C2.34 9.97 2 9.64 2 9.22C2 5.24 5.24 2 9.22 2C9.5 2 9.74 2.15 9.88 2.38C10.01 2.62 10.01 2.9 9.87 3.14L8.9 4.75C8.68 5.11 8.22 5.23 7.87 5.01C7.51 4.8 7.4 4.34 7.61 3.98L7.79 3.68C5.33 4.32 3.5 6.56 3.5 9.22C3.5 9.64 3.16 9.97 2.75 9.97Z" fill="#292D32"/>
            </svg>
        `);
        icon.appendTo(shapeContainer).attr({
            "id": componentsID.iconID,
            "x": "5",
            "y": "5"
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "dataConverter",
        title: "Data Converter",
        category: "Process",
        defaultText: "",
        defaultWidth: 1.5,
        defaultHeight: 1,
        minWidth: 1.5,
        minHeight: 1,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class ScriptCustonShape {
    private toolboxTemplate = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();

        $(`
            <svg viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg">
                <path d="M 400 400 L 400 62.5 C 400 41.8 383.225 25 362.5 25 L 93.325 25 C 97.575 32.35 100 40.9 100 50 L 100 450 C 100 463.8 111.2 475 125 475 C 138.8 475 150 463.8 150 450 L 150 412.5 C 150 405.6 155.6 400 162.5 400 L 400 400 Z M 425 400 L 487.5 400 C 494.4 400 500 405.6 500 412.5 L 500 437.5 C 500 472.025 472.025 500 437.5 500 L 125 500 C 97.4 500 75 477.625 75 450 L 75 100 L 50 100 C 22.4 100 0 77.625 0 50 C 0 22.375 22.4 0 50 0 L 362.5 0 C 397.025 0 425 27.975 425 62.5 L 425 400 Z M 175 425 L 175 450 C 175 459.1 172.575 467.65 168.325 475 L 437.5 475 C 458.225 475 475 458.2 475 437.5 L 475 425 L 175 425 Z M 75 75 L 75 50 C 75 36.2 63.8 25 50 25 C 36.2 25 25 36.2 25 50 C 25 63.8 36.2 75 50 75 L 75 75 Z M 162.5 125 C 155.6 125 150 119.4 150 112.5 C 150 105.6 155.6 100 162.5 100 L 337.5 100 C 344.4 100 350 105.6 350 112.5 C 350 119.4 344.4 125 337.5 125 L 162.5 125 Z M 162.5 200 C 155.6 200 150 194.4 150 187.5 C 150 180.6 155.6 175 162.5 175 L 337.5 175 C 344.4 175 350 180.6 350 187.5 C 350 194.4 344.4 200 337.5 200 L 162.5 200 Z M 162.5 275 C 155.6 275 150 269.4 150 262.5 C 150 255.6 155.6 250 162.5 250 L 337.5 250 C 344.4 250 350 255.6 350 262.5 C 350 269.4 344.4 275 337.5 275 L 162.5 275 Z M 162.5 350 C 155.6 350 150 344.4 150 337.5 C 150 330.6 155.6 325 162.5 325 L 287.5 325 C 294.4 325 300 330.6 300 337.5 C 300 344.4 294.4 350 287.5 350 L 162.5 350 Z" style="stroke: rgb(3, 3, 3); fill: rgb(3, 3, 3);"></path>
            </svg>
        `).appendTo(parentElement).attr({
            "x": (container.position as any).x * 100,
            "y": (container.position as any).y * 72,
        });
    };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "script");
        const componentsID = {
            rectID: Utils.getGuid(),
            iconID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        let rect = Utils.getNewSVGComponent("rect");
        rect.attr({
            "id": componentsID.rectID,
            "width": "100%",
            "height": "100%",
            "rx": "5",
            "ry": "5",
            "style": `
                troke: #DEDEDE;
                fill: rgb(250, 250, 250);
            `
        }).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });

        let icon = $(`
            <svg viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg">
                <path d="M 400 400 L 400 62.5 C 400 41.8 383.225 25 362.5 25 L 93.325 25 C 97.575 32.35 100 40.9 100 50 L 100 450 C 100 463.8 111.2 475 125 475 C 138.8 475 150 463.8 150 450 L 150 412.5 C 150 405.6 155.6 400 162.5 400 L 400 400 Z M 425 400 L 487.5 400 C 494.4 400 500 405.6 500 412.5 L 500 437.5 C 500 472.025 472.025 500 437.5 500 L 125 500 C 97.4 500 75 477.625 75 450 L 75 100 L 50 100 C 22.4 100 0 77.625 0 50 C 0 22.375 22.4 0 50 0 L 362.5 0 C 397.025 0 425 27.975 425 62.5 L 425 400 Z M 175 425 L 175 450 C 175 459.1 172.575 467.65 168.325 475 L 437.5 475 C 458.225 475 475 458.2 475 437.5 L 475 425 L 175 425 Z M 75 75 L 75 50 C 75 36.2 63.8 25 50 25 C 36.2 25 25 36.2 25 50 C 25 63.8 36.2 75 50 75 L 75 75 Z M 162.5 125 C 155.6 125 150 119.4 150 112.5 C 150 105.6 155.6 100 162.5 100 L 337.5 100 C 344.4 100 350 105.6 350 112.5 C 350 119.4 344.4 125 337.5 125 L 162.5 125 Z M 162.5 200 C 155.6 200 150 194.4 150 187.5 C 150 180.6 155.6 175 162.5 175 L 337.5 175 C 344.4 175 350 180.6 350 187.5 C 350 194.4 344.4 200 337.5 200 L 162.5 200 Z M 162.5 275 C 155.6 275 150 269.4 150 262.5 C 150 255.6 155.6 250 162.5 250 L 337.5 250 C 344.4 250 350 255.6 350 262.5 C 350 269.4 344.4 275 337.5 275 L 162.5 275 Z M 162.5 350 C 155.6 350 150 344.4 150 337.5 C 150 330.6 155.6 325 162.5 325 L 287.5 325 C 294.4 325 300 330.6 300 337.5 C 300 344.4 294.4 350 287.5 350 L 162.5 350 Z" style="stroke: rgb(3, 3, 3); fill: rgb(3, 3, 3);"></path>
            </svg>
        `);
        icon.appendTo(shapeContainer).attr({
            "id": componentsID.iconID,
            "x": "-20",
            "y": "5"
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "script",
        title: "Script",
        category: "Process",
        defaultText: "",
        defaultWidth: 1.5,
        defaultHeight: 1,
        minWidth: 1.5,
        minHeight: 1,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        toolboxTemplate: this.toolboxTemplate,
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class EndExceptionCustonShape {
    private toolboxTemplate = (container: any, data: any) => { };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.attr("id", "dx_custom_shape_start");
        const componentsID = {
            lineID: Utils.getGuid(),
            ellipseID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 215 215" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1.078574, 0, 0, 1.203558, -162.934113, -32.48341)">
                    <line id="${componentsID.lineID}" style="fill: rgb(216, 216, 216); stroke-linecap: round; stroke-width: 17.5275px; stroke: rgb(0, 0, 0);" x1="204.446" y1="116.604" x2="297.02" y2="116.012"></line>
                    <ellipse id="${componentsID.ellipseID}" style="fill: none; stroke: rgb(222, 222, 222); stroke-width: 8.76373px;" cx="250.733" cy="116.308" rx="92.715" ry="83.087"></ellipse>
                </g>
            </svg>
        `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.ellipseID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "endException",
        title: "End Exception",
        category: "Exception",
        defaultText: "",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        connectionPoints: [
            { x: 1, y: 0.5 },
            { x: 0, y: 0.5 }
        ],
        template: this.template
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class ExceptionSubprocessCustonShape {
    private toolboxTemplate = (container: any, data: any) => { };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        parentElement.append(shapeContainer);
        const componentsID = {
            rectID: Utils.getGuid(),
            lineID: Utils.getGuid(),
            textID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        let rect = Utils.getNewSVGComponent("rect");
        rect.attr({
            "width": "99.5%",
            "height": "99%",
            "id": componentsID.rectID,
            "style": `
                fill: rgb(250, 250, 250);
                stroke-dasharray: 4;
                stroke: rgb(222, 222, 222);
            `,
            "x": "1.5",
            "y": "1.5",
        });
        rect.appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", 'rgb(222, 222, 222)');
        });;

        let headerLine = Utils.getNewSVGComponent("line");
        headerLine.attr({
            "id": componentsID.lineID,
            "x1": "3",
            "y1": "35",
            "x2": "99.6%",
            "y2": "35",
            "style": `
                stroke-dasharray: 4;
                stroke: #DEDEDE;
            `
        });
        headerLine.appendTo(shapeContainer);

        let textHeader = Utils.getNewSVGComponent("text");
        textHeader.attr({
            "id": componentsID.textID,
            "x": "50%",
            "y": "25",
            "style": `
                font-size: 20px;
                font-family: Arial, sans-serif;
            `
        });
        textHeader.text("Exception Subprocess")
        textHeader.appendTo(shapeContainer);
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "exceptionSubprocess",
        title: "Exception Subprocess",
        baseType: "verticalContainer",
        category: "Exception",
        defaultHeight: 2,
        defaultWidth: 4,
        minHeight: 2,
        minWidth: 4,
        defaultText: "",
        toolboxTemplate: this.toolboxTemplate,
        template: this.template,
        connectionPoints: [{ x: 0, y: 0 }]
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}

class ConditionCustonShape {
    private toolboxTemplate = (container: any, data: any) => { };

    private template = (container: any, data: any) => {
        let shapeContainer = $(data);
        let parentElement = shapeContainer.parent();
        parentElement.children().remove();
        parentElement.append(shapeContainer);
        const componentsID = {
            rectID: Utils.getGuid(),
        };
        parentElement.attr({
            "data-custom-shape-infos": JSON.stringify(componentsID)
        });

        $(`
            <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <rect id="${componentsID.rectID}" width="340" height="340" style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(222, 222, 222); fill: rgb(250, 250, 250); stroke-width: 10px;" transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 80, 80)"></rect>
            </svg>
       `).appendTo(shapeContainer).on("mouseover", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#2d2ac7');
        }).on("mouseout", () => {
            $(`#${componentsID.rectID}`).css("stroke", '#DEDEDE');
        });
    };

    private _shape: DevExpress.ui.TCustomShape = {
        type: "condition",
        title: "Condition",
        category: "Process",
        allowResize: false,
        defaultWidth: 0.50,
        defaultHeight: 0.50,
        allowEditText: false,
        defaultText: "",
        template: this.template,
        connectionPoints: [{ x: 0.5, y: 1 }, { x: 1, y: 0.5 }, { x: 0, y: 0.5 }, { x: 0.5, y: 0 }]
    };

    get shape(): DevExpress.ui.TCustomShape {
        return this._shape;
    }
}
// #endregion