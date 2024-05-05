import { ShapeModel } from "./ShapeModel.js"

export interface IEndProcessModel {
}

export class EndProcessModel extends ShapeModel implements IEndProcessModel {
    constructor(ID?: string) {
        super("endProcess", ID);
    }
}