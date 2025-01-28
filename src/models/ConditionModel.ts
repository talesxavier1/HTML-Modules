
import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface IConditionModel {

}

export class ConditionModel extends ShapeModel implements IConditionModel {

    constructor(processContext?: ProcessContext, ID?: string) {
        super("condition", processContext, ID);

    }
}