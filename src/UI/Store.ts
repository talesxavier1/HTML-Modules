import { EntryModel } from "../models/EntryModel.js";

type EventName =
    | 'loaded'
    | 'loading'
    | 'inserted'
    | 'inserting'
    | 'updated'
    | 'updating'
    | 'push'
    | 'removed'
    | 'removing'
    | 'modified'
    | 'modifying';

export class Store {
    private _dxStore: DevExpress.data.ArrayStore;

    byKey(key: any): DevExpress.core.PromiseType<any> {
        return this._dxStore.byKey(key);
    }

    clear(): void {
        return this._dxStore.clear();
    }

    createQuery(): DevExpress.data.Query {
        return this._dxStore.createQuery();
    }

    load(): DevExpress.core.utils.DxExtendedPromise<any[]>;
    load(options: DevExpress.data.LoadOptions<any>): DevExpress.core.utils.DxExtendedPromise<any[]>;
    load(options?: any): DevExpress.core.utils.DxExtendedPromise<any[]> {
        if (options) {
            return this._dxStore.load(options);
        }
        else {
            return this._dxStore.load();
        }
    }

    insert(values: any): DevExpress.core.utils.DxExtendedPromise<any> {
        return this._dxStore.insert(values);
    }

    key(): string | string[] {
        return this._dxStore.key();
    }

    keyOf(obj: any) {
        return this._dxStore.keyOf(obj);
    }

    get off() {
        return this._dxStore.off;
    }

    on(eventName: EventName, eventHandler: Function): any;
    on(events: { [key in EventName]?: Function }): any;
    on(eventNameOrEvents: EventName | { [key in EventName]?: Function }, eventHandler?: Function): any {
        if (typeof eventNameOrEvents === 'object' && eventNameOrEvents !== null) {
            return this._dxStore.on(eventNameOrEvents);
        } else if (eventHandler) {
            return this._dxStore.on(eventNameOrEvents, eventHandler);
        }
    }

    push(changes: { type: "remove" | "update" | "insert"; data?: any; key?: any; index?: number | undefined; }[]): void {
        return this._dxStore.push(changes);
    }

    remove(key: any): DevExpress.core.PromiseType<void> {
        return this._dxStore.remove(key);
    }

    totalCount(obj: { filter?: any; group?: DevExpress.data.GroupDescriptor<any> | DevExpress.data.GroupDescriptor<any>[] | undefined; }): DevExpress.core.PromiseType<number> {
        return this._dxStore.totalCount(obj);
    }

    update(key: any, values: any): DevExpress.core.utils.DxExtendedPromise<any> {
        return this._dxStore.update(key, values);
    }

    constructor(options?: DevExpress.data.ArrayStore.Options<any, any>) {
        this._dxStore = new DevExpress.data.ArrayStore(options);
    }
}