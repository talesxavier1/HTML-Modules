import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface ISenderModel {
}

export class SenderModel extends ShapeModel implements ISenderModel {
    senderPath!: string
    senderName!: string
    constructor(processContext?: ProcessContext, ID?: string) {
        super("sender", processContext, ID);
    }
}