import { ShapeModel } from "./ShapeModel.ts"

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