import { ShapeModel } from "./ShapeModel"

export interface IMultcastOutModel {
}

export class MultcastOutModel extends ShapeModel implements IMultcastOutModel {
    constructor(ID?: string) {
        super("multicastOut", ID);
    }
}