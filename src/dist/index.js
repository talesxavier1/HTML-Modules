import { Diagram } from "./UI/Diagram.js";
const main = () => {
    let diagram = new Diagram();
    diagram.setDiagramOptions(JSON.stringify(diagramProps), diagramData);
};
const diagramProps = { "page": { "width": 16782, "height": 23812, "pageColor": -1, "pageWidth": 8391, "pageHeight": 11906, "pageLandscape": false }, "connectors": [], "shapes": [{ "key": "50", "dataKey": "8dbdd544-879d-4b9b-ad17-4189c78011db", "locked": false, "zIndex": 0, "type": "converter", "text": "", "x": 1188, "y": 8970, "width": 7944, "height": 4944 }] };
const diagramData = [{ "type": "converter", "text": "", "ID": "8dbdd544-879d-4b9b-ad17-4189c78011db" }];
main();
//# sourceMappingURL=index.js.map