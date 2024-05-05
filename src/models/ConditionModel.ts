
import { ShapeModel } from "./ShapeModel.js"

export interface IConditionModel {

}

export class ConditionModel extends ShapeModel implements IConditionModel {

    constructor(ID?: string) {
        super("condition", ID);

    }
}