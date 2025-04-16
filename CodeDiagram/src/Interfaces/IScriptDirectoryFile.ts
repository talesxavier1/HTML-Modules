import { IScriptDirectoryHeader } from "./IScriptDirectoryHeader";

export interface IScriptDirectoryFile extends IScriptDirectoryHeader {
    size?: number,
    dateModified?: string,
    content?: string
}