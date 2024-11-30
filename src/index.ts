
import { Splitter } from "./UI/splitter/Splitter";
import { Diagram } from "./UI/Diagram/Diagram";
import { TDiagramShapeClicked } from "./Types/TDiagramShapeClicked";
import { OptionsUI } from "./UI/Options/OptionsUI";
import diagramHTML from "./html/Splitter/Diagram.html";
import optionsHTML from "./html/Splitter/Options.html";

import DIAGRAM_DATA from "./Data/DIAGRAM_DATA.json";
import DIAGRAM_PROPS from "./Data/DIAGRAM_PROPS.json"


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
}

$(() => {
    main();
})

