import { ShapeModel } from "./ShapeModel"
declare const Swal: any;

export interface IMulticastInModel {
}

export class MulticastInModel extends ShapeModel implements IMulticastInModel {

    trackName: string = "";

    constructor(ID?: string) {
        super("multicastIn", ID);
    }
}