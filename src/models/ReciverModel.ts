import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IReciverModel {
    name: string
}

export class ReciverModel extends ShapeModel implements IReciverModel {
    name: string;

    constructor(processContext?: ProcessContext, ID?: string) {
        super("reciver", processContext, ID);
        this.name = "";
    }

}