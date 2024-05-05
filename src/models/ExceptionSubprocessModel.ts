import { ShapeModel } from "./ShapeModel.js"

export interface IExceptionSubprocessModel {
}

export class ExceptionSubprocessModel extends ShapeModel implements IExceptionSubprocessModel {
    constructor(ID?: string) {
        super("exceptionSubprocess", ID);
    }
}