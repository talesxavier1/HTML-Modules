import { IScriptDirectoryFile } from "../Interfaces/IScriptDirectoryFile";
import { ShapeModel } from "./ShapeModel"

export interface IScriptModel {
    scriptDirectoryContent: Array<IScriptDirectoryFile>
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    scriptDirectoryContent: Array<IScriptDirectoryFile> = [];

    constructor(ID?: string) {
        super("script", ID);
    }
}