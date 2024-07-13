import { TShapeType } from "../Types/TShapeType";
import { Utils } from "../Utils/Utils";


export interface IShapeModel {
    ID: string
    shapeType: TShapeType
    initialized: boolean
}

export class ShapeModel implements IShapeModel {
    ID: string;
    type: TShapeType;
    text: string;
    shapeType: TShapeType;
    private _initialized: boolean

    constructor(shapeType: TShapeType, ID?: string) {
        this.ID = ID ? ID : Utils.getGuid();
        this.shapeType = shapeType;
        this._initialized = true;
        this.type = shapeType;
        this.text = "";
    }

    get initialized(): boolean {
        return this._initialized
    }
}