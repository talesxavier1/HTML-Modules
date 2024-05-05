import { ShapeModel } from "./ShapeModel.js"

export interface ISenderModel {
}

export class SenderModel extends ShapeModel implements ISenderModel {
    constructor(ID?: string) {
        super("sender", ID);
    }
}