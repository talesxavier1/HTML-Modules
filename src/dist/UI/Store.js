export class Store {
    byKey(key) {
        return this._dxStore.byKey(key);
    }
    clear() {
        return this._dxStore.clear();
    }
    createQuery() {
        return this._dxStore.createQuery();
    }
    load(options) {
        if (options) {
            return this._dxStore.load(options);
        }
        else {
            return this._dxStore.load();
        }
    }
    insert(values) {
        return this._dxStore.insert(values);
    }
    key() {
        return this._dxStore.key();
    }
    keyOf(obj) {
        return this._dxStore.keyOf(obj);
    }
    get off() {
        return this._dxStore.off;
    }
    on(eventNameOrEvents, eventHandler) {
        if (typeof eventNameOrEvents === 'object' && eventNameOrEvents !== null) {
            return this._dxStore.on(eventNameOrEvents);
        }
        else if (eventHandler) {
            return this._dxStore.on(eventNameOrEvents, eventHandler);
        }
    }
    push(changes) {
        return this._dxStore.push(changes);
    }
    remove(key) {
        return this._dxStore.remove(key);
    }
    totalCount(obj) {
        return this._dxStore.totalCount(obj);
    }
    update(key, values) {
        return this._dxStore.update(key, values);
    }
    constructor(options) {
        this._dxStore = new DevExpress.data.ArrayStore(options);
    }
}
//# sourceMappingURL=Store.js.map