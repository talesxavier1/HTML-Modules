import { Utils } from "../lib/dx-utils/Utils.js";
import { IShapeModel, ShapeModel } from "./ShapeModel.js"

export interface IEntryModel {
    name: string
    path: string
}


export class EntryModel extends ShapeModel implements IEntryModel {

    name: string;
    path: string;
    testeIDCont: string;
    constructor(ID?: string) {
        super("entry", ID);
        this.name = "";
        this.path = "";
        this.testeIDCont = Utils.getGuid();
    }
}