import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IStartExceptionModel {
}

export class StartExceptionModel extends ShapeModel implements IStartExceptionModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("startException", processContext, ID);
    }
}