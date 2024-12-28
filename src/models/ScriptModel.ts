import { ShapeModel } from "./ShapeModel"

export interface IScriptModel {
    scriptType: "Script" | "Module" | "",
    packageVersionID: string
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    scriptType: "Script" | "Module" | "" = "";
    packageVersionID: string = "";

    constructor(ID?: string) {
        super("script", ID);
    }
}