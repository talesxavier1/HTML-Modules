import { dxComponents } from "./Consts.js";

export class DxDefaultValues {
    _ARRAY_COMPONENTS = dxComponents;

    _getComponent = (componentName) => {
        let componentFind = this._ARRAY_COMPONENTS.find(VALUE => VALUE.componentName == componentName);
        if (!componentFind) {
            throw new Error(`[ERRO]-[dxDefaultValues] Componente '${componentName}' não encontrado.`);
        }
        return componentFind;
    }

    getDefaultValue = (componentName) => {
        let result = this._getComponent(componentName)
        return result.defaultValue;
    }

    getValueField = (componentName) => {
        let result = this._getComponent(componentName);
        return result.valueField;
    }

    constructor() { }
}