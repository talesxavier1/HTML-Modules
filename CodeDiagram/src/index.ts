
import { Splitter } from "./UI/splitter/Splitter";
import { Diagram } from "./UI/Diagram/Diagram";
import { TDiagramShapeClicked } from "./Types/TDiagramShapeClicked";
import { OptionsUI } from "./UI/Options/OptionsUI";
import diagramHTML from "./html/Splitter/Diagram.html";
import optionsHTML from "./html/Splitter/Options.html";

import DIAGRAM_DATA from "./Data/DIAGRAM_DATA.json";
import DIAGRAM_PROPS from "./Data/DIAGRAM_PROPS.json"
import { Utils } from "./Utils/Utils";
import { ProcessContext } from "./models/ProcessContext";

let splitter: Splitter;
let diagram: Diagram;
let optionsUI: OptionsUI;
const main = async (): Promise<void> => {
    let readOnly = false;
    let mockProcessContext: ProcessContext = {
        "processID": "5818aaa6-32c6-4f9d-97de-78d855b129f2",
        "processVersionID": "e10b672b-1121-4459-a4e0-27bb93d10ffe",
        "assID": "b882275f-0e39-498d-b8d3-ece83fca1899"
    }

    splitter = new Splitter(diagramHTML, optionsHTML);
    diagram = new Diagram(mockProcessContext, readOnly);
    optionsUI = new OptionsUI(diagram.getNodeStore(), readOnly);

    diagram.setDiagramOptions(JSON.stringify(DIAGRAM_PROPS), DIAGRAM_DATA);

    splitter.onResizeEnd = () => {
        diagram.repaint();
    }

    diagram.shapeClicked = async (Event: TDiagramShapeClicked) => {
        let data = Event.shapeData;
        if (data) {
            await optionsUI.mountOptions(JSON.parse(JSON.stringify(Event.shapeData)));
        }
    }

    optionsUI.btnConfirmDeclineCliked = async (action, data) => {
        if (data) {
            diagram.updateNode(data.ID, data);
        }
    }

    botoesSuporte(diagram);
}

const botoesSuporte = (diagram: Diagram) => {

    $("#botao01").dxButton({
        text: "copy diagramProps",
        type: "danger",

        onClick: () => {
            let diagramPropsValue = diagram.getDiagramOptions().diagramPropsValue;

            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = diagramPropsValue;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

            DevExpress.ui.notify({
                message: `diagramProps copiado ${Utils.getGuid()}`,
                height: 45,
                width: 550,
                minWidth: 150,
                type: "success",
                displayTime: 1000,

            }, {
                position: "top right",
                direction: "down-push"
            });
        }
    }).dxButton("instance");

    $("#botao02").dxButton({
        text: "copy data",
        type: "danger",
        onClick: () => {
            let data = diagram.getDiagramOptions().data;
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = JSON.stringify(data);
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);

            DevExpress.ui.notify({
                message: `data copiado ${Utils.getGuid()}`,
                height: 45,
                width: 550,
                minWidth: 150,
                type: "success",
                displayTime: 1000,

            }, {
                position: "top right",
                direction: "down-push"
            });
        }
    }).dxButton("instance");

    $("#botao03").dxButton({
        text: "limpar log",
        type: "danger",
        onClick: () => {
            console.clear()
            DevExpress.ui.notify({
                message: `log limpo ${Utils.getGuid()}`,
                height: 45,
                width: 550,
                minWidth: 150,
                type: "success",
                displayTime: 1000,

            }, {
                position: "top right",
                direction: "down-push"
            });

        }
    }).dxButton("instance");

    $("#botao04").dxButton({
        text: "Local/Web",
        type: "danger",
        onClick: () => {
            let FILE_MANAGEMENT_BASE_API = localStorage.getItem("FILE_MANAGEMENT_BASE_API") ?? "";

            if (FILE_MANAGEMENT_BASE_API.indexOf("localhost") > -1) {
                localStorage.setItem("FILE_MANAGEMENT_BASE_API", "https://lw001tallesandrade.ddns.net/storageInterface/dev");
                DevExpress.ui.notify({
                    message: `lw001tallesandrade.ddns.net ${Utils.getGuid()}`,
                    height: 45,
                    width: 550,
                    minWidth: 150,
                    type: "success",
                    displayTime: 1000,

                }, {
                    position: "top center",
                    direction: "down-push"
                });
            } else {
                localStorage.setItem("FILE_MANAGEMENT_BASE_API", "http://localhost:9090");

                DevExpress.ui.notify({
                    message: `localhost ${Utils.getGuid()}`,
                    height: 45,
                    width: 550,
                    minWidth: 150,
                    type: "success",
                    displayTime: 1000,

                }, {
                    position: "top right",
                    direction: "down-push"
                });
            }

        }
    }).dxButton("instance");

    $("#botao05").dxButton({
        text: "GlobalLoadIndicator true/false",
        type: "danger",
        onClick: () => {
            let log = localStorage.getItem("LOG_GlobalLoadIndicator") ?? "false";

            let val = "";
            if (log == "false") {
                localStorage.setItem("LOG_GlobalLoadIndicator", "true");
                val = "true";
            } else {
                localStorage.setItem("LOG_GlobalLoadIndicator", "false");
                val = "false";
            }

            DevExpress.ui.notify({
                message: `LOG_GlobalLoadIndicator ${val}`,
                height: 45,
                width: 550,
                minWidth: 150,
                type: "success",
                displayTime: 1000,

            }, {
                position: "top right",
                direction: "down-push"
            });
        }
    }).dxButton("instance");

    $("#botao06").dxButton({
        text: "LOG pipelineEditOperation true/false",
        type: "danger",
        onInitialized(e) {
            localStorage.setItem("LOG_pipelineEditOperation", "false");
        },
        onClick: () => {
            let log = localStorage.getItem("LOG_pipelineEditOperation") ?? "false";

            let val = "";
            if (log == "false") {
                localStorage.setItem("LOG_pipelineEditOperation", "true");
                val = "true";
            } else {
                localStorage.setItem("LOG_pipelineEditOperation", "false");
                val = "false";
            }

            DevExpress.ui.notify({
                message: `LOG_pipelineEditOperation ${val}`,
                height: 45,
                width: 550,
                minWidth: 150,
                type: "success",
                displayTime: 1000,

            }, {
                position: "top right",
                direction: "down-push"
            });
        }
    }).dxButton("instance");
}



$(async () => {
    main();
})




