import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IProcessConatinerModel {
    name: string
}

export class ProcessContainerModel extends ShapeModel implements IProcessConatinerModel {
    name: string;

    constructor(processContext?: ProcessContext, ID?: string) {
        super("processContainer", processContext, ID);
        this.name = "";
    }
}