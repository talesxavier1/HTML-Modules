import { TShapeType } from "../Types/TShapeType";
import { Utils } from "../Utils/Utils";
import { ProcessContext } from "./ProcessContext";


export interface IShapeModel {
    ID: string
    shapeType: TShapeType
}

export class ShapeModel implements IShapeModel {
    ID: string;
    type: TShapeType;
    text: string;
    shapeType: TShapeType;
    containerKey?: string;
    processContext: ProcessContext;

    constructor(shapeType: TShapeType, processContext?: ProcessContext, ID?: string,) {
        this.ID = ID ? ID : Utils.getGuid();
        this.shapeType = shapeType;
        this.type = shapeType;
        this.text = "";
        if (processContext) {
            this.processContext = processContext;
        } else {
            this.processContext = new ProcessContext();
        }
    }


}