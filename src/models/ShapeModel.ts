import { TShapeType } from "../Types/TShapeType";
import { Utils } from "../Utils/Utils";


export interface IShapeModel {
    ID: string
    shapeType: TShapeType
}

export class ShapeModel implements IShapeModel {
    ID: string;
    type: TShapeType;
    text: string;
    shapeType: TShapeType;
    containerKey?: string
    constructor(shapeType: TShapeType, ID?: string) {
        this.ID = ID ? ID : Utils.getGuid();
        this.shapeType = shapeType;
        this.type = shapeType;
        this.text = "";
    }


}