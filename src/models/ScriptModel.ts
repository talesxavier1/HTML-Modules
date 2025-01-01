import { TMonacoLanguage } from "../Types/TMonacoLanguage";
import { ShapeModel } from "./ShapeModel"

export interface IScriptModel {
    scriptType: "Script" | "Module" | "",
    scriptLanguage: TMonacoLanguage | "";
    packageVersionID: string
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    scriptType: "Script" | "Module" | "" = "";
    packageVersionID: string = "";
    scriptLanguage: TMonacoLanguage | "" = "";

    constructor(ID?: string) {
        super("script", ID);
    }

}