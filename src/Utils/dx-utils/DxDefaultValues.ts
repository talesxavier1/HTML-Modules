import { DxComponentValue, ListdxComponentValue } from "./Consts";

export class DxDefaultValues {
    private ARRAY_COMPONENTS: Array<DxComponentValue> = ListdxComponentValue;

    private getComponent = (componentName: string): DxComponentValue => {
        let componentFind = this.ARRAY_COMPONENTS.find((VALUE: DxComponentValue) => VALUE.componentName == componentName);
        if (!componentFind) {
            throw new Error(`[ERRO]-[dxDefaultValues] Componente '${componentName}' não encontrado.`);
        }
        return componentFind;
    }

    getDefaultValue = (componentName: string) => {
        let result: DxComponentValue = this.getComponent(componentName)
        return result.defaultValue;
    }

    getValueField = (componentName: string) => {
        let result: DxComponentValue = this.getComponent(componentName);
        return result.valueField;
    }

    constructor() { }
}