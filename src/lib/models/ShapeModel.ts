import { Utils } from "../dx-utils/Utils.js";

export interface IShapeModel {
    ID: string,
    type: "entry" | "ss"
}

export class ShapeModel implements IShapeModel {
    ID: string;
    type: "entry";

    constructor() {
        this.ID = Utils.getGuid();
    }
}