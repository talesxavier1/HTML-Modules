import { ShapeModel } from "./ShapeModel"

export interface IScriptModel {
    scriptType: string,
    packageVersionID: string
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    scriptType: string = "";
    packageVersionID: string = "";

    constructor(ID?: string) {
        super("script", ID);
    }
}