import { Utils } from "../lib/dx-utils/Utils.js";
export class ShapeModel {
    constructor(shapeType, ID) {
        this.ID = ID ? ID : Utils.getGuid();
        this.shapeType = shapeType;
        this._initialized = true;
        this.type = shapeType;
        this.text = "";
    }
    get initialized() {
        return this._initialized;
    }
}
//# sourceMappingURL=ShapeModel.js.map