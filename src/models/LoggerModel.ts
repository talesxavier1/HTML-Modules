import { ProcessContext } from "./ProcessContext";
import { ShapeModel } from "./ShapeModel"

export interface ILoggerModel {
}

export class LoggerModel extends ShapeModel implements ILoggerModel {
    constructor(processContext?: ProcessContext, ID?: string) {
        super("logger", processContext, ID);
    }
}