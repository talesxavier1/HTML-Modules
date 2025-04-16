import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IEndProcessModel {
}

export class EndProcessModel extends ShapeModel implements IEndProcessModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("endProcess", processContext, ID);
    }
}