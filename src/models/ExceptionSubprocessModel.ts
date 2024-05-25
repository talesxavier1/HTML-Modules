import { ShapeModel } from "./ShapeModel.ts"

export interface IExceptionSubprocessModel {
}

export class ExceptionSubprocessModel extends ShapeModel implements IExceptionSubprocessModel {
    constructor(ID?: string) {
        super("exceptionSubprocess", ID);
    }
}