import { GUID } from "./guid.js";

/**
 * Classe base dos nodes.
 * @class
 */
export class BaseNodeModel {
    /**
     * Id do node.
     * @type {string}
     */
    id;

    /**
     * Id de referência do node com o seu node pai.
     * @type {string}
     */
    id_ref = "";

    /**
     * Nome do node. Campo que é exibido no treeview.
     * @type {string}
     */
    text = "";

    /**
     * Define se o node pode ser expandido ou não.
     * @type {boolean}
     */
    expanded = false;

    /**
     * Define se o node irá possuir botão de adicionar node filho no seu contextMenu.
     * @type {boolean}
     */
    contextAddBtn = false;

    /**
     * Define se o node irá possuir botão de remover node filho no seu contextMenu.
     * @type {boolean}
     */
    contextRemoveBtn = true;

    /**
     * Definições do node.
     * @type {BaseNodeValueModel}
     */
    node_value;

    /**
     * @constructor
     * @param {string | null} id_ref Id de referência do node pai.
     * @description {id} Campo recebe um guid. 
     * @description {node_value} Campo recebe uma instancia de BaseNodeValueModel.
     *  
    */
    constructor(id_ref) {
        this.id = GUID.getGUID();
        this.node_value = new BaseNodeValueModel();
        this.id_ref = id_ref ? id_ref : null;
    }
}


export class BaseNodeValueModel {
    /**
    * ** A Ordem de declaração dos componentes do objeto inpacta nas regras de visualização dos componentes.
    * ** EXEMPLO: se um campo do tipo Text estiver declarado antes de um checkBox que ativa a sua edição, o devExtreme não altera do valor da instância e o campo Text fica vazio.
    */

    /**
     * Nome interno do campo. é usado como key na montagem do jsonSchema.
     * @requires
     * @type {string}
     */
    text_name = '';

    /**
     * Descrição do campo. Pode ser um nome ou uma frase. campo que é exibido no nodeTree.
     * @requires
     * @type {string}
     */
    text_description = '';

    /**
     * Tipo do campo.
     * @type {("string"|"number"|"integer"|"object"|"array"|"boolean"|"enum")}
     */
    select_type = null;

    /**
     * Indica se campo é obrigatório.
     * @type {boolean}
     */
    checkbox_required = false;

    /**
     * Indica se campo pode ser nulo.
     * @type {boolean}
     */
    checkbox_nullable = false;

    /**
     * Indica se campo pode ter elementos adicionais.
     * @type {boolean}
     */
    checkbox_additional_properties = false;

    /**
     * Tipo tipo dos itens do array.
     * @type {("string"|"number"|"integer"|"object"|"array"|"boolean"|"enum")}
     */
    select_array_type = null;

    /**
     * Indica se o array possui valor mínimo de componentes
     * @type {boolean}
     */
    checkbox_array_min = false;

    /**
     * Indica se o array possui valor máximo de componentes
     * @type {boolean}
     */
    checkbox_array_max = false;

    /**
     * Quantidade mínima de itens no array.
     * @type {number}
     */
    number_array_min = 0;

    /**
     * Quantidade máxima de itens no array.
     * @type {number}
     */
    number_array_max = 0;

    /**
     * Indica se array deve ter somente itens únicos.
     * @type {boolean}
     */
    checkbox_array_unique_items = false;

    /**
     * Indica se campo do tipo texto tem expressão regular para validação. 
     * @type {boolean}
     */
    checkbox_string_regular_expression = false;

    /**
     * Indica se a string tem um formato expecífico. 
     * @type {boolean}
     */
    checkbox_string_format = false;

    /**
     * Indica o formato selecionado para a string
     * @type {(null|"date-time"|"time"|"date"|"duration"|"email"|"idn-email"|"hostname"|"idn-hostname"|"ipv4"|"ipv6"|"uuid"|"uri"|"uri-reference"|"iri"|"iri-reference"|"uri-template"|"json-pointer"|"regex")}
     */
    select_string_format = null;

    /**
     * Indica se a string possui tamanho máximo.
     * @type {boolean}
     */
    checkbox_string_length_greater = false;

    /**
     * Indica o tamanho máximo da string.
     * @type {number}
     */
    number_string_length_greater = 0;

    /**
     * Indica se a string possui tamanho mínimo.
     * @type {boolean}
     */
    checkbox_string_length_less = false;

    /**
     * Tamanho mínimo da string.
     * @type {number}
     */
    number_string_length_less = 0;

    /**
     * Expresão regular. 
     * @type {string}
     */
    text_string_regular_expression = '';

    /**
     * Condição do range maior que. 
     * @type {(null | "maior_que" | "maior_ou_igual")}
     */
    select_numeric_greater = null;

    /**
     * Valor para maior que.
     * @type {number}
     */
    number_numeric_greater = 0;

    /**
     * Condição do range meor que. 
     * @type {(null | "menor_que" | "menor_ou_igual")}
     */
    select_numeric_less = null;

    /**
     * Valor para menor que.
     * @type {number}
     */
    number_numeric_less = 0;

    /**
     * Indica se o componente do tipo number ou integer deve receber apenas números múltiplos.
     * @type {boolean}
     */
    checkbox_numeric_multiple = false;

    /**
     * Valor para numero múltiplo do componente
     * @type {number}
     */
    number_numeric_multiple = 0;

    /**
     * Lista de valores para campo do tipo enum.
     * @type {Array<string>}
     */
    list_enum_values = [];

    /**
     * Indica se o componente do tipo object deve aceitar apenas chaves com um padrão expecífico.
     * @type {boolean}
     */
    checkbox_object_pattern_keys = false;

    /**
     * Padrão que o as chaves do object devem seguir.
     * @type {string}
     */
    text_object_pattern_keys = "";

    constructor() { }
}

export class BaseTabModel {

    /**
     * Id da tab.
     * @type {string} 
     */
    id = "";

    /**
     * Texto de exibição da tab.
     * @type {string} 
     */
    text = "";

    /**
     * Icone da tab
     * @type {string} 
     */
    icon = "";

    /**
     * @param {object} param
     * @param {string} id Id da tab.
     * @param {string} text Texto de exibição da tab.
     * @param {string} icon Icone da aba.
     */
    constructor({ id, text, icon }) {
        this.id = id;
        this.text = text;
        this.icon = icon;
    }
}
