import { ShapeModel } from "./ShapeModel"

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