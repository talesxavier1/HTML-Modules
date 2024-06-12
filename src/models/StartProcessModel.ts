import { ShapeModel } from "./ShapeModel"

export interface IStartProcessModel {
}

export class StartProcessModel extends ShapeModel implements IStartProcessModel {
    constructor(ID?: string) {
        super("startProcess", ID);
    }
}