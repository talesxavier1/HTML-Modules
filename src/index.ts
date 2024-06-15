
import { Diagram } from "./UI/Diagram";

const main = (): void => {
    let diagram = new Diagram();
    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);

}

const diagramProps: any = { "page": { "width": 25173, "height": 23812, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "71", "dataKey": "cdc4371d-631d-4f1f-9de0-ef4bff9dbe83", "locked": false, "zIndex": 0, "type": "processContainer", "text": "", "x": 2601, "y": 7264, "width": 14400, "height": 7200, "childKeys": ["72", "73"] }, { "key": "72", "dataKey": "773168fe-766b-4b0f-88e7-611b55361e16", "locked": false, "zIndex": 0, "type": "multicastIn", "text": "", "x": 3197, "y": 11212, "width": 720, "height": 720 }, { "key": "73", "dataKey": "ecf59092-4260-400a-ac25-ce991d6dbc5f", "locked": false, "zIndex": 0, "type": "multicastIn", "text": "", "x": 3707, "y": 9570, "width": 720, "height": 720 }] }


// teste 03 04
/* SS */
/* AI AI 2 */
const diagramData: any = [{ "ID": "cdc4371d-631d-4f1f-9de0-ef4bff9dbe83", "type": "processContainer", "text": "", "shapeType": "processContainer", "_initialized": true, "name": "" }, { "type": "multicastIn", "text": "", "containerKey": "cdc4371d-631d-4f1f-9de0-ef4bff9dbe83", "ID": "773168fe-766b-4b0f-88e7-611b55361e16", "shapeType": "multicastIn", "_initialized": true, "trackName": "sss" }, { "type": "multicastIn", "text": "", "containerKey": "cdc4371d-631d-4f1f-9de0-ef4bff9dbe83", "ID": "ecf59092-4260-400a-ac25-ce991d6dbc5f", "shapeType": "multicastIn", "_initialized": true, "trackName": "sad" }]


main();
