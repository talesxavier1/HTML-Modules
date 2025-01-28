import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IExceptionSubprocessModel {
}

export class ExceptionSubprocessModel extends ShapeModel implements IExceptionSubprocessModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("exceptionSubprocess", processContext, ID);
    }
}