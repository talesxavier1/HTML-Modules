import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IStartProcessModel {
}

export class StartProcessModel extends ShapeModel implements IStartProcessModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("startProcess", processContext, ID);
    }
}