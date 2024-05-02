
import { Diagram } from "./UI/Diagram.js";
import { Utils } from "./lib/dx-utils/Utils.js";
import { EntryModel } from "./models/EntryModel.js";

const main = (): void => {
    let diagram = new Diagram();

    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);

}





const diagramProps: any = { "page": { "width": 16782, "height": 23812, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "51", "dataKey": "6a7236d9-cc54-59cd-dc7d-62da9851fc26", "locked": false, "zIndex": 0, "type": "converter", "text": "", "x": 11454, "y": 13744, "width": 2160, "height": 1440 }, { "key": "52", "dataKey": "d2d5ba70-f767-c173-2b1b-d856fdac871a", "locked": false, "zIndex": 0, "type": "condition", "text": "", "x": 7472, "y": 11451, "width": 720, "height": 720 }] }

const diagramData: any = [{ "ID": "6a7236d9-cc54-59cd-dc7d-62da9851fc26", "type": "converter", "text": "" }, { "type": "condition", "text": "", "ID": "d2d5ba70-f767-c173-2b1b-d856fdac871a" }]

main();
