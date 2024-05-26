
import { ShapeModel } from "./ShapeModel"

export interface IConditionModel {

}

export class ConditionModel extends ShapeModel implements IConditionModel {

    constructor(ID?: string) {
        super("condition", ID);

    }
}