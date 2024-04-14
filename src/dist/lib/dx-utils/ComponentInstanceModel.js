export class ComponentInstanceModel {
    constructor(dataObject) {
        this.ARRAY_COMPONENTS_INSTANCES = [];
        this.ARRAY_COMPONENTS_FUNCTIONS = [];
        this.addInstance = (instanceProps) => {
            this.ARRAY_COMPONENTS_INSTANCES.push(instanceProps);
        };
        this.getInstanceProps = (tagName) => {
            let value = this.ARRAY_COMPONENTS_INSTANCES.find(VALUE => VALUE.getTagName() == tagName);
            if (!value) {
                throw new Error(`[ERRO]-[ComponentInstanceModel] instancia com tagName '${tagName} não encontrada'.`);
            }
            return value;
        };
        this.getInstanceValue = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            return instance.getInstanceValue();
        };
        this.setInstanceValue = (tagName, value) => {
            let instance = this.getInstanceProps(tagName);
            instance.setInstanceValue(value);
        };
        this.clearInstanceValue = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            instance.clearInstanceValue();
        };
        this.disableEnableInstance = (tagName, valueParam) => {
            let instance = this.getInstanceProps(tagName);
            instance.disableEnableInstance(valueParam);
        };
        this.disableInstance = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            instance.disableInstance();
        };
        this.enableInstance = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            instance.enableInstance();
        };
        this.setVisibleInvisibleInstance = (tagName, valueParam) => {
            let instance = this.getInstanceProps(tagName);
            instance.setVisibleInvisibleInstance(valueParam);
        };
        this.setInvisibleInstance = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            instance.setInvisibleInstance();
        };
        this.setVisibleInstance = (tagName) => {
            let instance = this.getInstanceProps(tagName);
            instance.setVisibleInstance();
        };
        this.getBuiltObject = () => {
            let data = this.dataObject;
            for (let KEY of Object.keys(data)) {
                data[KEY] = this.getInstanceValue(KEY);
            }
            return data;
        };
        this.setBuiltObject = (dataObject) => {
            let data = dataObject;
            for (let KEY of Object.keys(data)) {
                this.setInstanceValue(KEY, data[KEY]);
            }
        };
        this.addFunction = (functionProps) => {
            this.ARRAY_COMPONENTS_FUNCTIONS.push(functionProps);
        };
        this.getFullFunctionDefinition = (tagName) => {
            let result = this.ARRAY_COMPONENTS_FUNCTIONS.find(VALUE => VALUE.tagName == tagName);
            if (!result) {
                console.log(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar functionInstance com tag name '${tagName}'`);
                return;
            }
            return result.functionDefinition;
        };
        this.getFunctionIntances = (tagName, functionTag) => {
            let functionComponents = this.getFullFunctionDefinition(tagName);
            if (!functionComponents) {
                return;
            }
            if (Array.isArray(functionComponents)) {
                let func = functionComponents.find(VALUE => VALUE.functionTag == functionTag);
                if (func) {
                    return func.functionAction;
                }
                else {
                    console.warn(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar função com nome '${functionTag}' em '${tagName}'`);
                }
            }
            else {
                console.warn(`[AVISO]-[ComponentInstanceModel] FunctionDefinition de '${tagName}' não é um array de funções`);
            }
        };
        this.getFunction = (tagName, functionName) => {
            if (functionName) {
                return this.getFunctionIntances(tagName, functionName);
            }
            else {
                return this.getFullFunctionDefinition(tagName);
            }
        };
        this.dataObject = dataObject;
    }
}
//# sourceMappingURL=ComponentInstanceModel.js.map