import { Utils } from "../Utils/Utils";
import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IMulticastInModel {
}

export class MulticastInModel extends ShapeModel implements IMulticastInModel {
    trackName: string;

    constructor(processContext?: ProcessContext, ID?: string) {
        super("multicastIn", processContext, ID);
        this.trackName = Utils.getGuid().split("-")[0];
    }
}