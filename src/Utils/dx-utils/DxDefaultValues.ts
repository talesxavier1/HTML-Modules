import { IdxComponentValue, ListdxComponentValue } from "./Consts";

export class DxDefaultValues {
    private ARRAY_COMPONENTS: Array<IdxComponentValue> = ListdxComponentValue;

    private getComponent = (componentName: string): IdxComponentValue => {
        let componentFind = this.ARRAY_COMPONENTS.find((VALUE: IdxComponentValue) => VALUE.componentName == componentName);
        if (!componentFind) {
            throw new Error(`[ERRO]-[dxDefaultValues] Componente '${componentName}' não encontrado.`);
        }
        return componentFind;
    }

    getDefaultValue = (componentName: string) => {
        let result: IdxComponentValue = this.getComponent(componentName)
        return result.defaultValue;
    }

    getValueField = (componentName: string) => {
        let result: IdxComponentValue = this.getComponent(componentName);
        return result.valueField;
    }

    constructor() { }
}