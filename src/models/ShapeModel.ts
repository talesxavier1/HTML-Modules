import { Utils } from "../lib/dx-utils/Utils.js";

type ShapeType = "entry";
export interface IShapeModel {
    ID: string
    shapeType: ShapeType
    initialized: boolean
}

export class ShapeModel implements IShapeModel {
    ID: string;
    shapeType: ShapeType;
    private _initialized: boolean

    constructor(shapeType: ShapeType, ID?: string) {
        this.ID = ID ? ID : Utils.getGuid();
        this.shapeType = shapeType;
        this._initialized = true;
    }

    get initialized(): boolean {
        return this._initialized
    }
}