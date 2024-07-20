import { InstanceProps } from "./InstanceProps";
import { FunctionProps } from "./FunctionProps";

export class ComponentInstanceModel<T> {
    private ARRAY_COMPONENTS_INSTANCES: Array<InstanceProps> = [];
    private ARRAY_COMPONENTS_FUNCTIONS: Array<FunctionProps> = [];
    private dataObject: T;

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

    public addInstance = (instanceProps: InstanceProps) => {
        this.ARRAY_COMPONENTS_INSTANCES.push(instanceProps);
    }

    public getInstanceProps = (tagName: string): InstanceProps => {
        let value = this.ARRAY_COMPONENTS_INSTANCES.find(VALUE => VALUE.getTagName() == tagName);
        if (!value) {
            throw new Error(`[ERRO]-[ComponentInstanceModel] instancia com tagName '${tagName} não encontrada'.`);
        }
        return value;
    }

    public getInstanceValue = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        return instance.getInstanceValue();
    }

    public setInstanceValue = (tagName: string, value: any): void => {
        let instance = this.getInstanceProps(tagName);
        instance.setInstanceValue(value);
    }

    public clearInstanceValue = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.clearInstanceValue();
    }

    public disableEnableInstance = (tagName: string, valueParam: boolean): void => {
        let instance = this.getInstanceProps(tagName);
        instance.disableEnableInstance(valueParam);
    }

    public disableInstance = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.disableInstance();
    }

    public enableInstance = (tagName: string): void => {
        let instance = this.getInstanceProps(tagName);
        instance.enableInstance();
    }

    public setVisibleInvisibleInstance = (tagName: string, valueParam?: boolean): void => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInvisibleInstance(valueParam);
    }

    public setInvisibleInstance = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        instance.setInvisibleInstance();
    }

    public setVisibleInstance = (tagName: string) => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInstance();
    }

    public getBuiltObject = (): T => {
        let data: any = this.dataObject;
        for (let KEY of Object.keys(data)) {
            data[KEY] = this.getInstanceValue(KEY);
        }
        return data;
    }

    public setBuiltObject = (dataObject: T) => {
        let data: any = dataObject;
        for (let KEY of Object.keys(data)) {
            this.setInstanceValue(KEY, data[KEY]);
        }
    }

    public addFunction = (functionProps: FunctionProps) => {
        this.ARRAY_COMPONENTS_FUNCTIONS.push(functionProps);
    }

    public getFunction = (tagName: string, functionName?: string) => {
        if (functionName) {
            return this.getFunctionIntances(tagName, functionName);
        } else {
            return this.getFullFunctionDefinition(tagName);
        }

    }

    public disposeInstance = (tagName: string) => {
        let instanceProps = this.getInstanceProps(tagName);
        instanceProps?.getInstance()?.dispose();
    }

    public disposeAllInstances = () => {
        this.ARRAY_COMPONENTS_INSTANCES.forEach(VALUE => {
            this.disposeInstance(VALUE.getTagName());
        })
    }

    public repaint = (tagName: string) => {
        let instanceProps = this.getInstanceProps(tagName);
        let instance: any = instanceProps?.getInstance();
        try {
            instance.repaint();
        } catch (e) { }
    }

    public repaintAllInstances = () => {
        this.ARRAY_COMPONENTS_INSTANCES.forEach(VALUE => {
            this.repaint(VALUE.getTagName())
        });
    }
    constructor(dataObject: T) {
        this.dataObject = dataObject;
    }
}

