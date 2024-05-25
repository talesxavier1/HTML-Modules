import { ShapeModel } from "./ShapeModel.ts"

export interface IEndExceptionModel {
}

export class EndExceptioModel extends ShapeModel implements IEndExceptionModel {
    constructor(ID?: string) {
        super("endException", ID);
    }
}