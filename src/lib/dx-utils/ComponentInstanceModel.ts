import { InstanceProps } from "./InstanceProps.js";
import { FunctionProps } from "./FunctionProps.js";

export class ComponentInstanceModel<T> {
    private ARRAY_COMPONENTS_INSTANCES: Array<InstanceProps> = [];
    private ARRAY_COMPONENTS_FUNCTIONS: Array<FunctionProps> = [];
    private dataObject: T;

    addInstance = (instanceProps: InstanceProps) => {
        this.ARRAY_COMPONENTS_INSTANCES.push(instanceProps);
    }

    getInstanceProps = (tagName: string): InstanceProps => {
        let value = this.ARRAY_COMPONENTS_INSTANCES.find(VALUE => VALUE.getTagName() == tagName);
        if (!value) {
            throw new Error(`[ERRO]-[ComponentInstanceModel] instancia com tagName '${tagName} não encontrada'.`);
        }
        return value;
    }

    getInstanceValue = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        return instance.getInstanceValue();
    }

    setInstanceValue = (tagName: string, value: any): void => {
        let instance = this.getInstanceProps(tagName);
        instance.setInstanceValue(value);
    }

    clearInstanceValue = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.clearInstanceValue();
    }

    disableEnableInstance = (tagName: string, valueParam: boolean): void => {
        let instance = this.getInstanceProps(tagName);
        instance.disableEnableInstance(valueParam);
    }

    disableInstance = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.disableInstance();
    }

    enableInstance = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.enableInstance();
    }

    setVisibleInvisibleInstance = (tagName: string, valueParam?: boolean): void => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInvisibleInstance(valueParam);
    }

    setInvisibleInstance = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        instance.setInvisibleInstance();
    }

    setVisibleInstance = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInstance();
    }

    getBuiltObject = (): T => {
        let data: any = this.dataObject;
        for (let KEY of Object.keys(data)) {
            data[KEY] = this.getInstanceValue(KEY);
        }
        return data;
    }

    setBuiltObject = (dataObject: T) => {
        let data: any = dataObject;
        for (let KEY of Object.keys(data)) {
            this.setInstanceValue(KEY, data[KEY]);
        }
    }

    addFunction = (functionProps: FunctionProps) => {
        this.ARRAY_COMPONENTS_FUNCTIONS.push(functionProps);
    }

    private getFullFunctionDefinition = (tagName: string) => {
        let result = this.ARRAY_COMPONENTS_FUNCTIONS.find(VALUE => VALUE.tagName == tagName);
        if (!result) {
            console.log(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar functionInstance com tag name '${tagName}'`)
            return;
        }
        return result.functionDefinition;
    }

    private getFunctionIntances = (tagName: string, functionTag: string) => {
        let functionComponents = this.getFullFunctionDefinition(tagName);
        if (!functionComponents) { return }

        if (Array.isArray(functionComponents)) {
            let func = functionComponents.find(VALUE => VALUE.functionTag == functionTag);
            if (func) {
                return func.functionAction;
            } else {
                console.warn(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar função com nome '${functionTag}' em '${tagName}'`);
            }
        } else {
            console.warn(`[AVISO]-[ComponentInstanceModel] FunctionDefinition de '${tagName}' não é um array de funções`);
        }
    }

    getFunction = (tagName: string, functionName?: string) => {
        if (functionName) {
            return this.getFunctionIntances(tagName, functionName);
        } else {
            return this.getFullFunctionDefinition(tagName);
        }

    }

    constructor(dataObject: T) {
        this.dataObject = dataObject;
    }
}

