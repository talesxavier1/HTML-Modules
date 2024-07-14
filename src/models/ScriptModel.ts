import { ShapeModel } from "./ShapeModel"

interface IScriptDirectoryFile extends IScriptDirectoryHeader {
    size?: number,
    dateModified?: string,
    content?: string
}

interface IScriptDirectoryHeader {
    name: string,
    isDirectory: boolean,
    __KEY__: string,
    items?: Array<IScriptDirectoryFile>,
}


export interface IScriptModel {
    scriptDirectoryContent: Array<IScriptDirectoryFile>
}

export class ScriptModel extends ShapeModel implements IScriptModel {
    scriptDirectoryContent: Array<IScriptDirectoryFile> = [];

    constructor(ID?: string) {
        super("script", ID);
    }
}