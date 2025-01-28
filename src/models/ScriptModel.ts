import { TMonacoLanguage } from "../Types/TMonacoLanguage";
import { ProcessContext } from "./ProcessContext";
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

    constructor(processContext?: ProcessContext, ID?: string) {
        super("script", processContext, ID);
    }

}