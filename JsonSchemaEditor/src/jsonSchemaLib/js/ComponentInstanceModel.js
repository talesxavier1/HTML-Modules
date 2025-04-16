import { InstanceProps } from "./InstanceProps.js";
import { BaseNodeValueModel } from "./BaseModels.js"
import { FunctionProps } from "./FunctionProps.js";

export class ComponentInstanceModel {
    _ARRAY_COMPONENTS_INSTANCES = [];
    _ARRAY_COMPONENTS_FUNCTIONS = [];

    /**
     * Adiciona uma instância ao Array de instâncias.
     * @param {InstanceProps} instanceProps
     * @returns {void}
     * @throws Lança um erro caso o parâmetro instanceProps não for passado.
     */
    addInstance = (instanceProps) => {
        if (!(instanceProps instanceof InstanceProps)) {
            throw new Error(`[ERRO]-[ComponentInstanceModel] Parametro inválido.`);
        }

        this._ARRAY_COMPONENTS_INSTANCES.push(instanceProps);
    }

    /**
     * @param {Sring} tagName Tag usada como chave para identificar a instância.
     * @returns {InstanceProps} Instância
     * @throws Lança um erro caso a intância procurada não seja encontrada.
     */
    getInstanceProps = (tagName) => {
        let value = this._ARRAY_COMPONENTS_INSTANCES.find(VALUE => VALUE.tagName == tagName);
        if (!value) {
            throw new Error(`[ERRO]-[ComponentInstanceModel] instancia com tagName '${tagName} não encontrada'.`);
        }
        return value;
    }

    /**
     * Procura uma instância com tag name igual a passada e retorna o valor da instância.
     * 
     * O tipo de retorno irá denpender do tipo de componente DevExtreme.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @returns {any} Valor encontrado para a instância.
     */
    getInstanceValue = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        return instance.getInstanceValue();
    }

    /**
     * Atuliza o valor da instância
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @param {any} value Valor que deve ser setado no instância.
     * @returns {void}
     */
    setInstanceValue = (tagName, value) => {
        let instance = this.getInstanceProps(tagName);
        instance.setInstanceValue(value);
    }

    /**
     * Define o valor padrão da instância.
     * 
     * O valor que será setado irá depender do tipo de componente DevExtreme.
     * @param {String} tagName
     * @returns {void}
     */
    clearInstanceValue = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        instance.clearInstanceValue();
    }

    /**
     * Habilita ou desabilita a instância.
     * 
     * Quando valueParam não é passado, a instância rebece o valor inverso do campo disabled atual.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @param {boolean | undefined} valueParam
     * @returns {void}
     */
    disableEnableInstance = (tagName, valueParam) => {
        let instance = this.getInstanceProps(tagName);
        instance.disableEnableInstance(valueParam);
    }

    /**
     * Desabilita a instância.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @returns {void}
     */
    disableInstance = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        instance.disableInstance();
    }

    /**
    * Habilita a instância.
    * @param {String} tagName Tag usada como chave para identificar a instância.
    * @returns {void} 
    */
    enableInstance = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        instance.enableInstance();
    }

    /**
     * Deixa a instância invisível.
     * 
     * Se valueParam não for passado, o valor setado será o inverso do atual.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @param {boolean | undefined} valueParam
     * @returns {void}
     */
    setVisibleInvisibleInstance = (tagName, valueParam) => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInvisibleInstance(valueParam);
    }

    /**
     * Deixa a instância invisível.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @returns {void}
     */
    setInvisibleInstance = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        instance.setInvisibleInstance();
    }

    /**
     * Deixa a instância invisível.
     * @param {String} tagName Tag usada como chave para identificar a instância.
     * @returns {void}
     */
    setVisibleInstance = (tagName) => {
        let instance = this.getInstanceProps(tagName);
        instance.setVisibleInstance();
    }

    /**
     * Monta um objeto BaseNodeValueModel com base nas Key desse objeto.
     * 
     * ** As Keys do obj BaseNodeValueModel devem ser iguais as tagNames das instâncias.
     * @returns {BaseNodeValueModel} Classe com todas as configurações do node.
     */
    getBuiltObject = () => {
        var baseNodeValueModel = new BaseNodeValueModel();
        for (let KEY of Object.keys(baseNodeValueModel)) {
            baseNodeValueModel[KEY] = this.getInstanceValue(KEY);
        }
        return baseNodeValueModel;
    }

    /**
     * Seta um Node Value para a instância.
     * @param {BaseNodeValueModel} nodeObject Classe com todas as configurações do node.
     * @throws Lança um erro caso nodeObject não for uma insância de BaseNodeValueModel.
     */
    setBuiltObject = (nodeObject) => {
        if (!(nodeObject instanceof BaseNodeValueModel)) { throw new Error(`[ERRO]-[ComponentInstanceModel] Parametro inválido.`); };
        for (let KEY of Object.keys(nodeObject)) {
            this.setInstanceValue(KEY, nodeObject[KEY]);
        }
    }

    /**
     * Adiciona um conjunto de funções ao array.
     * 
     * Essas funções podem ser utilizadas em qualquer lugar.
     * @param {FunctionProps} functionProps Classe com as configurações das funções
     * @throws Lança um erro caso functionProps não for uma instância de FunctionProps.
     */
    addFunction = (functionProps) => {
        if (!(functionProps instanceof FunctionProps)) {
            throw new Error(`[ERRO]-[ComponentInstanceModel] Parametro inválido.`);
        }
        this._ARRAY_COMPONENTS_FUNCTIONS.push(functionProps);
    }

    /**
     * Busca a function com base no tagName
     * @param {String} tagName identificador da function. 
     * @returns {Object} Objeto com todas as funções 
     * @throws Lança um erro caso a function não seja encontrada.
     * @private
     */
    _getFullFunctionIntances = (tagName) => {
        if (typeof tagName != "string") {
            throw new Error(`[ERRO]-[ComponentInstanceModel] Parâmetro inválido.`);
        }
        let result = this._ARRAY_COMPONENTS_FUNCTIONS.find(VALUE => VALUE.tagName == tagName);
        if (!result) {
            console.log(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar functionInstance com tag name '${tagName}'`)
            return;
        }
        return result.functionDefinition;
    }

    /**
     * Busca a FunctionProps e encontra a function com nome passado em functionName
     * @param {String} tagName Identificador da FunctionProps
     * @param {String} functionName Nome da Function definition
     * @returns {Function} Função encontrada
     * @throws Lança um erro caso tagName ou functionName não forem String
     * @private
     */
    _getFunctionIntances = (tagName, functionName) => {
        if (typeof functionName != "string" || typeof functionName != "string") {
            throw new Error(`[ERRO]-[ComponentInstanceModel] Parâmetro inválido.`);
        }
        let functionComponents = this._getFullFunctionIntances(tagName);
        if (!functionComponents) { return }

        if (!functionComponents.hasOwnProperty(functionName)) {
            console.warn(`[AVISO]-[ComponentInstanceModel] Não foi possível encontrar função com nome '${functionName}' em '${tagName}'`);
            return;
        }

        return functionComponents[functionName];
    }

    /**
     * Busca um conjunto de Funções ou uma função expecífica.
     * 
     * @param {String} tagName identificador da FunctionProps
     * @param {String | undefined} functionName Nome da função expecífica.
     * @returns {Function | Object} Retorna uma função expecífica ou um obj com todas as funções dispoíveis.
     */
    getFunction = (tagName, functionName) => {
        if (functionName) {
            return this._getFunctionIntances(tagName, functionName);
        } else {
            return this._getFullFunctionIntances(tagName);
        }

    }

    constructor() { }
}

