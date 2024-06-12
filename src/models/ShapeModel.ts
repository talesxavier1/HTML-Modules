import { Utils } from "../Utils/Utils";

type ShapeType = "sender" | "processContainer" | "reciver" | "condition" | "exceptionSubprocess" | "endException" | "script" | "dataConverter" | "startException" | "multicastOut" | "multicastIn" | "endProcess" | "startProcess";
export interface IShapeModel {
    ID: string
    shapeType: ShapeType
    initialized: boolean
}

export class ShapeModel implements IShapeModel {
    ID: string;
    type: string;
    text: string;
    shapeType: ShapeType;
    private _initialized: boolean

    constructor(shapeType: ShapeType, ID?: string) {
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