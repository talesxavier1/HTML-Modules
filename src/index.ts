
import { Diagram } from "./UI/Diagram.js";
import { Utils } from "./lib/dx-utils/Utils.js";
import { SenderModel } from "./models/SenderModel.js";

const main = (): void => {
    let diagram = new Diagram();

    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);

}





const diagramProps: any = { "page": { "width": 33564, "height": 23812, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "0", "dataKey": "9e73be9c-217b-4bba-a834-6742538f0522", "locked": false, "zIndex": 0, "type": "processContainer", "text": "", "x": 12274, "y": 6459, "width": 14400, "height": 7200, "childKeys": ["1"] }, { "key": "1", "dataKey": "fb6307dc-4975-4d62-bf7c-eefa201a0d6e", "locked": false, "zIndex": 0, "type": "startProcess", "text": "", "x": 14627, "y": 9531, "width": 720, "height": 720 }, { "key": "2", "dataKey": "f2ff11c0-e283-4dc0-9d56-a584f0a0aec8", "locked": false, "zIndex": 0, "type": "sender", "text": "", "x": 7967, "y": 11223, "width": 2160, "height": 2880 }] }

const diagramData: any = [{ "type": "processContainer", "text": "", "ID": "9e73be9c-217b-4bba-a834-6742538f0522", "shapeType": "processContainer", "_initialized": true, "name": "" }, { "type": "startProcess", "text": "", "containerKey": "9e73be9c-217b-4bba-a834-6742538f0522", "ID": "fb6307dc-4975-4d62-bf7c-eefa201a0d6e", "shapeType": "startProcess", "_initialized": true }, { "type": "sender", "text": "", "ID": "f2ff11c0-e283-4dc0-9d56-a584f0a0aec8", "shapeType": "sender", "_initialized": true }]

main();
