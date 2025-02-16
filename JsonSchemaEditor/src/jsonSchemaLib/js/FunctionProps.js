export class FunctionProps {
    /**
     * @type {Object | Function} Objeto com várias funçoes ou uma única função. 
     */
    functionDefinition;

    /**
     * @type {string} Identificado da FunctionProps.
     */
    tagName;

    /**
     * @constructor
     * @param {Object} param
     * @param {Function | functionDefinition} param.functionDefinition Função ou objeto com um conjunto de funções.
     * @param {string} param.tagName Identificador do FunctionProps.
     * @throws Lança um erro caso functionDefinition não seja uma função ou caso não seja um objeto.
     * @throws Lança um erro caso functionDefinition for um objeto, mas não conter apenas funções.
     * @throws Lança um erro caso tagName não for string.
     */
    constructor({ functionDefinition, tagName }) {

        if (!["object", "function"].includes(typeof functionDefinition)) {
            throw new Error(`[ERRO]-[FunctionProps] Parâmetro inválido.`);
        }
        if (typeof functionDefinition == "object") {
            Object.keys(functionDefinition).forEach(VALUE => {
                if (typeof functionDefinition[VALUE] != "function") {
                    throw new Error(`[ERRO]-[FunctionProps] Parâmetro inválido.`);
                }
            });
        }
        if (typeof tagName != "string") {
            throw new Error(`[ERRO]-[FunctionProps] Parâmetro inválido.`);
        }

        this.functionDefinition = functionDefinition;
        this.tagName = tagName;
    }
}