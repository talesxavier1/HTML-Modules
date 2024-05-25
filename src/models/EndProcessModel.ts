import { ShapeModel } from "./ShapeModel.ts"

export interface IEndProcessModel {
}

export class EndProcessModel extends ShapeModel implements IEndProcessModel {
    constructor(ID?: string) {
        super("endProcess", ID);
    }
}