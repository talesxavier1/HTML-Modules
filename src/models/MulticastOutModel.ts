import { ShapeModel } from "./ShapeModel.js"

export interface IMultcastOutModel {
}

export class MultcastOutModel extends ShapeModel implements IMultcastOutModel {
    constructor(ID?: string) {
        super("multicastOut", ID);
    }
}