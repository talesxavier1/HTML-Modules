import { ProcessContext } from "../models/ProcessContext";
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
import { TDataSource } from "../Types/TDataSource";

export class NodeStore {
    private processContext: ProcessContext;
    private _store: DevExpress.data.ArrayStore<TDataSource, String>;
    private removedNodes: Map<string, TDataSource> = new Map<string, TDataSource>;

    private onInserting(data: TDataSource): void {
        let dataCopy = JSON.parse(JSON.stringify(data));
        switch (data.type) {
            case "sender":
                Object.assign(data, new SenderModel(this.processContext, data.ID), dataCopy);
                break;
            case "processContainer":
                Object.assign(data, new ProcessContainerModel(this.processContext, data.ID), dataCopy);
                break;
            case "reciver":
                Object.assign(data, new ReciverModel(this.processContext, data.ID), dataCopy);
                break;
            case "condition":
                Object.assign(data, new ConditionModel(this.processContext, data.ID), dataCopy);
                break;
            case "exceptionSubprocess":
                Object.assign(data, new ExceptionSubprocessModel(this.processContext, data.ID), dataCopy);
                break;
            case "endException":
                Object.assign(data, new EndExceptioModel(this.processContext, data.ID), dataCopy);
                break;
            case "script":
                Object.assign(data, new ScriptModel(this.processContext, data.ID), dataCopy);
                break;
            case "logger":
                Object.assign(data, new LoggerModel(this.processContext, data.ID), dataCopy);
                break;
            case "startException":
                Object.assign(data, new StartExceptionModel(this.processContext, data.ID), dataCopy);
                break;
            case "multicastOut":
                Object.assign(data, new MultcastOutModel(this.processContext, data.ID), dataCopy);
                break;
            case "multicastIn":
                Object.assign(data, new MulticastInModel(this.processContext, data.ID), dataCopy);
                break;
            case "endProcess":
                Object.assign(data, new EndProcessModel(this.processContext, data.ID), dataCopy);
                break;
            case "startProcess":
                Object.assign(data, new StartProcessModel(this.processContext, data.ID), dataCopy);
                break;
            default:
                new Error(`[Erro] tipo "${data.type}" não encontrado.`);
        }
    }

    private onInserted(data: TDataSource): void {
        /* Para os casos onde o Node é deletado. o conteúdo é atualizado após ele ser reencerido no store. */
        let removedNode = this.removedNodes.get(data.ID);
        if (removedNode) {
            this.removedNodes.delete(data.ID);
            this._store.update(removedNode.ID, removedNode);
        }
    }

    /* Faz o cache dos dados do node para caso seja reestabelecido */
    private onRemoving(value: string): void {
        let removedNode = this.getByKey(value);
        if (removedNode) {
            this.removedNodes.set(value, removedNode);
        }
    }

    private errorHandler(Error: any): void {
        console.error(Error);
    }

    public getAll(): Array<TDataSource> {
        let data: Array<TDataSource> = []
        this._store.load().done((res: Array<TDataSource>) => data = res);
        return data;
    }

    public getByKey(key?: string): TDataSource | undefined {
        if (!key) { return }

        let query = this._store.createQuery().filter(["ID", key]);
        let result;
        query.enumerate().always((VALUE: Array<TDataSource>) => {
            if (VALUE.length > 0) {
                result = VALUE[0];
            }
        });
        return result
    }

    constructor(key: string, processContext: ProcessContext) {
        this.processContext = processContext;
        this._store = new DevExpress.data.ArrayStore<TDataSource, String>({
            key: key,
            data: [],
            onInserting: (value) => this.onInserting(value),
            errorHandler: (value: any) => this.errorHandler(value),
            onRemoving: (value) => this.onRemoving(value as string),
            onInserted: (value) => this.onInserted(value)
        });
    }

    get store(): DevExpress.data.ArrayStore<TDataSource, String> {
        return this._store
    }
}