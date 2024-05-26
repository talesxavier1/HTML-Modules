import { ShapeModel } from "./ShapeModel"

export interface IExceptionSubprocessModel {
}

export class ExceptionSubprocessModel extends ShapeModel implements IExceptionSubprocessModel {
    constructor(ID?: string) {
        super("exceptionSubprocess", ID);
    }
}