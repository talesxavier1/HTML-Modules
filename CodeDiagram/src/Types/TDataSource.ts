import { ConditionModel } from "../models/ConditionModel";
import { EndExceptioModel } from "../models/EndExceptionModel";
import { EndProcessModel } from "../models/EndProcessModel";
import { ExceptionSubprocessModel } from "../models/ExceptionSubprocessModel";
import { LoggerModel } from "../models/LoggerModel";
import { MulticastInModel } from "../models/MulticastInModel";
import { MultcastOutModel } from "../models/MulticastOutModel";
import { ProcessContainerModel } from "../models/ProcessContainerModel";
import { ReciverModel } from "../models/ReciverModel";
import { ScriptModel } from "../models/ScriptModel";
import { SenderModel } from "../models/SenderModel";
import { StartExceptionModel } from "../models/startExceptionModel";
import { StartProcessModel } from "../models/StartProcessModel";

export type TDataSource =
    SenderModel |
    ProcessContainerModel |
    ReciverModel |
    ConditionModel |
    ExceptionSubprocessModel |
    EndExceptioModel |
    ScriptModel |
    LoggerModel |
    StartExceptionModel |
    MultcastOutModel |
    MulticastInModel |
    StartProcessModel |
    EndProcessModel;