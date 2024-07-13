import { ShapeModel } from "./ShapeModel"

export interface ISenderModel {
}

export class SenderModel extends ShapeModel implements ISenderModel {
    senderPath!: string
    senderName!: string
    constructor(ID?: string) {
        super("sender", ID);
    }
}