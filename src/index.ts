
import { Diagram } from "./UI/Diagram.js";
import { Utils } from "./lib/dx-utils/Utils.js";
import { EntryModel } from "./models/EntryModel.js";

const main = (): void => {
    let diagram = new Diagram();

    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);

}




const diagramProps: any = { "page": { "width": 16782, "height": 23812, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "45", "dataKey": "e7a3ee4b-0e0c-67ba-5d35-9793a7c1dac3", "locked": false, "zIndex": 0, "type": "multicast_in", "text": "", "x": 984, "y": 11082, "width": 3392, "height": 3593 }, { "key": "46", "dataKey": "4b68a366-5a78-0679-2dd3-be8b3ba16e24", "locked": false, "zIndex": 0, "type": "multicast_out", "text": "", "x": 8015, "y": 11611, "width": 3335, "height": 3164.0000000000005 }] }

const diagramData: any = [{ "type": "multicast_in", "text": "", "ID": "e7a3ee4b-0e0c-67ba-5d35-9793a7c1dac3" }, { "type": "multicast_out", "text": "", "ID": "4b68a366-5a78-0679-2dd3-be8b3ba16e24" }]
main();
