import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IEndExceptionModel {
}

export class EndExceptioModel extends ShapeModel implements IEndExceptionModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("endException", processContext, ID);
    }
}