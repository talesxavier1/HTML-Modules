import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IMultcastOutModel {
}

export class MultcastOutModel extends ShapeModel implements IMultcastOutModel {
    trackNameOrigin: string = "";

    constructor(processContext?: ProcessContext, ID?: string) {
        super("multicastOut", processContext, ID);
    }
}