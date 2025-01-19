export class EdgesStore {

    private _store: DevExpress.data.ArrayStore<any, String>;

    private onInserting(data: any): void {

    }

    private errorHandler(Error: any): void {
        debugger;
    }

    public getAll(): Array<any> {
        let data: Array<any> = []
        this._store.load().done((res: Array<any>) => data = res);
        return data;
    }

    public getByToKey(toKey: String): Array<any> {
        let query = this._store.createQuery().filter(["to", toKey]);

        let result: Array<any> = [];
        query.enumerate().done((values: Array<any>) => result = values);
        return result;
    }

    public getByFromKey(fromKey: string): Array<any> {
        let query = this._store.createQuery().filter(["from", fromKey]);

        let result: Array<any> = [];
        query.enumerate().done((values: Array<any>) => result = values);
        return result;
    }

    public getByKey(key?: string): any | null {
        if (!key) { return null }
        let result;
        this._store.byKey(key).done((VAL: any) => { result = VAL })
        return result ?? null
    }

    constructor(key: string) {
        this._store = new DevExpress.data.ArrayStore<any, String>({
            key: key,
            data: [],
            onInserting: this.onInserting,
            errorHandler: this.errorHandler
        });
    }

    get store(): DevExpress.data.ArrayStore<any, String> {
        return this._store
    }
}
