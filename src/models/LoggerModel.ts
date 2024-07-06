import { ShapeModel } from "./ShapeModel"

export interface ILoggerModel {
}

export class LoggerModel extends ShapeModel implements ILoggerModel {
    constructor(ID?: string) {
        super("logger", ID);
    }
}