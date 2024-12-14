
import { Splitter } from "./UI/splitter/Splitter";
import { Diagram } from "./UI/Diagram/Diagram";
import { TDiagramShapeClicked } from "./Types/TDiagramShapeClicked";
import { OptionsUI } from "./UI/Options/OptionsUI";
import diagramHTML from "./html/Splitter/Diagram.html";
import optionsHTML from "./html/Splitter/Options.html";

import DIAGRAM_DATA from "./Data/DIAGRAM_DATA.json";
import DIAGRAM_PROPS from "./Data/DIAGRAM_PROPS.json"
import { Utils } from "./Utils/Utils";

let splitter: Splitter;
let diagram: Diagram;
let optionsUI: OptionsUI;
const main = async (): Promise<void> => {

    splitter = new Splitter(diagramHTML, optionsHTML);
    diagram = new Diagram();
    optionsUI = new OptionsUI(diagram.getNodeStore());

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
                position: "top center",
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
                position: "top center",
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
                position: "top center",
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
                    position: "top center",
                    direction: "down-push"
                });
            }

        }
    }).dxButton("instance");
}



$(async () => {
    main();
})




