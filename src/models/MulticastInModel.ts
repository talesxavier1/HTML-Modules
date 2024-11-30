import { Utils } from "../Utils/Utils";
import { ShapeModel } from "./ShapeModel"

export interface IMulticastInModel {
}

export class MulticastInModel extends ShapeModel implements IMulticastInModel {
    trackName: string;

    constructor(ID?: string) {
        super("multicastIn", ID);
        this.trackName = Utils.getGuid().split("-")[0];
    }
}