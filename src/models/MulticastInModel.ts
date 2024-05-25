import { ShapeModel } from "./ShapeModel.ts"

export interface IMultcastInModel {
}

export class MultcastInModel extends ShapeModel implements IMultcastInModel {
    constructor(ID?: string) {
        super("multicastIn", ID);
    }
}