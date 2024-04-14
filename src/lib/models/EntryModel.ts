import { IShapeModel, ShapeModel } from "./ShapeModel.js"

export interface IEntryModel {
    name: string
    path: string
}


export class EntryModel extends ShapeModel implements IEntryModel {
    name: string;
    path: string;

    constructor() {
        super();
        this.type = "entry";
        this.name = "";
        this.path = "";
    }
}