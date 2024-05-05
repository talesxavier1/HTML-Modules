import { ShapeModel } from "./ShapeModel.js"

export interface IReciverModel {
    name: string
}

export class ReciverModel extends ShapeModel implements IReciverModel {
    name: string;

    constructor(ID?: string) {
        super("reciver", ID);
        this.name = "";
    }
}