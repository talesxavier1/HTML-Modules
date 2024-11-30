import { IScriptDirectoryFile } from "./IScriptDirectoryFile";

export interface IScriptDirectoryHeader {
    name: string,
    isDirectory: boolean,
    __KEY__: string,
    items?: Array<IScriptDirectoryFile>,
}