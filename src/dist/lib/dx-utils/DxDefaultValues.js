import { ListdxComponentValue } from "./Consts.js";
export class DxDefaultValues {
    constructor() {
        this.ARRAY_COMPONENTS = ListdxComponentValue;
        this.getComponent = (componentName) => {
            let componentFind = this.ARRAY_COMPONENTS.find((VALUE) => VALUE.componentName == componentName);
            if (!componentFind) {
                throw new Error(`[ERRO]-[dxDefaultValues] Componente '${componentName}' não encontrado.`);
            }
            return componentFind;
        };
        this.getDefaultValue = (componentName) => {
            let result = this.getComponent(componentName);
            return result.defaultValue;
        };
        this.getValueField = (componentName) => {
            let result = this.getComponent(componentName);
            return result.valueField;
        };
    }
}
//# sourceMappingURL=DxDefaultValues.js.map