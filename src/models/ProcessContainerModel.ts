import { ShapeModel } from "./ShapeModel.js"

export interface IProcessConatinerModel {
    name: string
}

export class ProcessContainerModel extends ShapeModel implements IProcessConatinerModel {
    name: string;

    constructor(ID?: string) {
        super("processContainer", ID);
        this.name = "";
    }
}