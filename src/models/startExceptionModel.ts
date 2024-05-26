import { ShapeModel } from "./ShapeModel"

export interface IStartExceptionModel {
}

export class StartExceptionModel extends ShapeModel implements IStartExceptionModel {
    constructor(ID?: string) {
        super("startException", ID);
    }
}