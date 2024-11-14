
import { Splitter } from "./UI/splitter/Splitter";
import { Diagram } from "./UI/Diagram/Diagram";
import { TDiagramShapeClicked } from "./Types/TDiagramShapeClicked";
import { OptionsUI } from "./UI/Options/OptionsUI";
import diagramHTML from "./html/Splitter/Diagram.html";
import optionsHTML from "./html/Splitter/Options.html";

import DIAGRAM_DATA from "./Data/DIAGRAM_DATA.json";
import DIAGRAM_PROPS from "./Data/DIAGRAM_PROPS.json"
import { GlobalLoadIndicator } from "./UI/GlobalLoadIndicator/GlobalLoadIndicator";


let splitter: Splitter;
let diagram: Diagram;
let optionsUI: OptionsUI;
const main = async (): Promise<void> => {


    // return;
    splitter = new Splitter(diagramHTML, optionsHTML);
    diagram = new Diagram();
    optionsUI = new OptionsUI(diagram.getNodeStore());

    diagram.setDiagramOptions(JSON.stringify(DIAGRAM_PROPS), DIAGRAM_DATA);

    splitter.onResizeEnd = () => {
        diagram.repaint();
    }

    diagram.shapeClicked = async (Event: TDiagramShapeClicked) => {
        let data = Event.shapeData;
        GlobalLoadIndicator.show();
        if (data) {
            await optionsUI.mountOptions(JSON.parse(JSON.stringify(Event.shapeData)));
        }
        GlobalLoadIndicator.hide();

    }

    optionsUI.btnConfirmDeclineCliked = async (action, data) => {
        if (data) {
            diagram.updateNode(data.ID, data);
        }
    }
}

$(() => {
    main();
})

