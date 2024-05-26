import { ShapeModel } from "./ShapeModel"

export interface IEndProcessModel {
}

export class EndProcessModel extends ShapeModel implements IEndProcessModel {
    constructor(ID?: string) {
        super("endProcess", ID);
    }
}