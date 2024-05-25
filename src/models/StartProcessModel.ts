import { ShapeModel } from "./ShapeModel.ts"

export interface IStartProcessModel {
}

export class StartProcessModel extends ShapeModel implements IStartProcessModel {
    constructor(ID?: string) {
        super("startProcess", ID);
    }
}