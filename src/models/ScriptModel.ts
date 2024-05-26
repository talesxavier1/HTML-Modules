//
import { ShapeModel } from "./ShapeModel"

export interface IScriptModel {
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    constructor(ID?: string) {
        super("script", ID);
    }
}