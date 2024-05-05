import { ShapeModel } from "./ShapeModel.js"

export interface IEndExceptionModel {
}

export class EndExceptioModel extends ShapeModel implements IEndExceptionModel {
    constructor(ID?: string) {
        super("endException", ID);
    }
}