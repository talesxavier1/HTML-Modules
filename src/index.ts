
import { Diagram } from "./UI/Diagram.js";
import { Utils } from "./lib/dx-utils/Utils.js";
import { EntryModel } from "./models/EntryModel.js";

const main = (): void => {
    let diagram = new Diagram();

    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);

}




const diagramProps: any = { "page": { "width": 8391, "height": 11906, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "1", "dataKey": "7595bb46-a416-9186-196c-cb1d7228dccc", "locked": false, "zIndex": 0, "type": "start", "text": "", "x": 4140, "y": 4680, "width": 900, "height": 900 }] }

const diagramData: any = [{ "type": "start", "text": "", "ID": "7595bb46-a416-9186-196c-cb1d7228dccc" }]
main();
