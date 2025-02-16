import { ComponentInstanceModel } from "./ComponentInstanceModel.js";
import { InstanceProps } from "./InstanceProps.js"
import { FunctionProps } from "./FunctionProps.js";
import { icons } from "./Consts.js";
import { BaseNodeModel, BaseNodeValueModel, BaseTabModel } from "./BaseModels.js";
import { GUID } from "./guid.js";

export class ConfigComponents {
    /**
     * Instancia da classe ComponentInstanceModel que é usada para armazenar e gerenciar as instâncias.
     * @private
     * @type {ComponentInstanceModel}
     */
    _componentInstanceModel = new ComponentInstanceModel();
    /**
     * nodeId do item atual.
     * @type {string}
     */
    _node_id = "";

    /**
     * Evento chamado quando o botão de confirmar é clicado no painel de configurações.
     * @param {object} param
     * @param {object} param.event Evento do clique.
     * @param {string} param.nodeId Id do node do event.
     * @param {BaseNodeModel} param.nodeObject Valor final do node.
     * @returns {void}
     */
    onConfirmClick = ({ event, nodeId, nodeObject }) => { };

    /**
     * Evento de cancelamento de edição do node.
     * 
     * @param {object} param
     * @param {object} param.event evento de click.
     * @param {string} param.nodeId ID do node cancelado.
     */
    onDeclineClick = ({ event, nodeId }) => { };

    /**
     * Atualiza as informações do painel de configuração.
     * Recebe os dados de um node e popula os campos do formulário.
     * @param {BaseNodeValueModel} nodeObject 
     * @param {string} node_id
     * @param {string} id_ref
     * @returns {void}
     */
    setNodeObject = (nodeObject, node_id, id_ref) => {
        this._componentInstanceModel.setBuiltObject(nodeObject);
        this._node_id = node_id;
        this._componentInstanceModel.getFunction("js_config_buttons_decline_confirm", "enabledComponents")(true);
        this._componentInstanceModel.getFunction("js_config_main_props", "enabledComponents")(true);


        if (!id_ref) {
            this._componentInstanceModel.disableInstance("checkbox_nullable");
            this._componentInstanceModel.disableInstance("checkbox_required");
        }
    }

    /**
     * Esconde ou exibe o painel de configurações com base no parâmetro visible passado.
     * @param {boolean} visible 
     * @throws lança erro caso o parâmetro passado não seja boolean.
     * @returns {void}
     */
    hideShowConfigs = (visible) => {
        if (typeof visible != "boolean") {
            throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
        }
        this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "configVisible")(visible);
    }

    /**
    * Habilita ou desabilita todos os componentes do painel de configurações com base no valor de 'enabled' passado.
    * @param {boolean} enabled 
    * @throws lança erro caso o parâmetro passado não seja boolean.
    * @returns {void}
    */
    enabledConfigs = (enabled) => {
        if (typeof enabled != "boolean") {
            throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
        }
        this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "enabledComponents")(enabled);
    }

    /**
     * limpa todos os campos do painel config.
     * @returns {void}
     */
    clearConfigs = () => {
        this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "cleanAll")();
    }

    /**
     * Recebe um objeto BaseNodeValueModel e executa validações de campos com base no select_type.
     * @param {BaseNodeValueModel} builtObject 
     * @returns {boolean}
     */
    validConfigs = (builtObject) => {
        let requiredListNotify = [];
        if (!builtObject.text_description) {
            requiredListNotify.push("Descrição");
        }
        if (!builtObject.text_name) {
            requiredListNotify.push("Nome");
        }
        if (!builtObject.select_type) {
            requiredListNotify.push("Tipo");
        }

        /* Tipo Array */
        if (builtObject.select_type == "array") {
            if (!builtObject.select_array_type) {
                requiredListNotify.push("Tipo de array");
            }

            let minArray = builtObject?.number_array_min?.toString();
            if (builtObject.checkbox_array_min) {
                if (!minArray) {
                    requiredListNotify.push("Array min");
                }
            }

            let maxArray = builtObject?.number_array_max?.toString();
            if (builtObject.checkbox_array_max) {
                if (!maxArray) {
                    requiredListNotify.push("Array max");
                }
                else if (maxArray == '0') {
                    DevExpress.ui.notify(`Array max não pode ser zero.`, 'error');
                    return false;
                }
            }

            if (builtObject.checkbox_array_min && builtObject.checkbox_array_max && (Number(maxArray) < Number(minArray))) {
                DevExpress.ui.notify(`Array max não pode ser menor que array min`, 'error');
                return false;
            }
        }

        /* Tipo String */
        if (builtObject.select_type == "string") {
            if (builtObject.checkbox_string_regular_expression && !builtObject.text_string_regular_expression) {
                requiredListNotify.push("Expressão");
            }

            if (builtObject.checkbox_string_format && !builtObject.select_string_format) {
                requiredListNotify.push("Format");
            }

            if (builtObject.checkbox_string_length_greater && !builtObject.number_string_length_greater) {
                requiredListNotify.push("Valor Tamanho máximo");
            }

            if (builtObject.checkbox_string_length_greater && builtObject.checkbox_string_length_less) {
                if (builtObject.number_string_length_greater < builtObject.number_string_length_less) {
                    DevExpress.ui.notify(`Campo Tamanho máximo não pode ser menor que Tamanho mínimo. `, 'error');
                    return false;
                }
            }
        }

        /* Tipos Integer e Number */
        if (["integer", "number"].includes(builtObject.select_type)) {
            if (builtObject.checkbox_numeric_multiple && !builtObject.number_numeric_multiple) {
                requiredListNotify.push("Valor múltiplo");
            }

            let greater = builtObject.number_numeric_greater.toString();
            let greaterSelect = builtObject.select_numeric_greater;
            if (greaterSelect && !greater) {
                requiredListNotify.push("Valor Maior que");
            }

            let less = builtObject.number_numeric_less.toString();
            let lessSelect = builtObject.select_numeric_less;
            if (lessSelect && !less) {
                requiredListNotify.push("Valor Menor que");
            }
        }

        /* Tipo Object */
        if (builtObject.select_type == "object") {
            if (builtObject.checkbox_object_pattern_keys && !builtObject.text_object_pattern_keys) {
                requiredListNotify.push("Pattern");
            }
        }

        if (builtObject.select_type == "enum") {
            if (builtObject.list_enum_values.length == 0) {
                requiredListNotify.push("Valores para enum.");
            }
        }

        if (requiredListNotify.length > 0) {
            DevExpress.ui.notify(`Campo(s) ${requiredListNotify.join(", ")} obrigatório(s)`, 'error');
            return false;
        }

        return true;
    }

    /**
     * @constructor
     * Construtor da classe.
     * @description Cria as instâncias dos componentes devExtreme.
     */
    constructor() {

        this._componentInstanceModel.addInstance(new InstanceProps({ //btnShow
            "componentName": "dxButton",
            "instance": $("#btnShow").dxButton({
                visible: false,
                type: 'normal',
                icon: "hidepanel",
                focusStateEnabled: false,
                onClick: (() => this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "configVisible")(true))
            }).dxButton("instance"),
            "tagName": "btnShow"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //btnHide
            "componentName": "dxButton",
            "instance": $("#btnHide").dxButton({
                type: 'normal',
                icon: "showpanel",
                focusStateEnabled: false,
                onClick: (() => this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "configVisible")(false))
            }).dxButton("instance"),
            "tagName": "btnHide"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //button_confirm
            "componentName": "dxButton",
            "instance": $("#button_confirm").dxButton({
                disabled: true,
                type: 'success',
                template: `
                    <span><img src="${icons.confirmFile.type},${icons.confirmFile.value}" width="65%" /></span>
                    <span>CONFIRMAR</span>
                `,
                focusStateEnabled: false,
                onClick: (event) => {
                    let nodeId = this._node_id;
                    let builtObject = this._componentInstanceModel.getBuiltObject();
                    if (!this.validConfigs(builtObject)) { return; }

                    this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "cleanAll")();
                    this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "enabledComponents")(false);
                    this._componentInstanceModel.getFunction("js_config_buttons_decline_confirm", "enabledComponents")(false);
                    this._node_id = "";

                    this.onConfirmClick({ event, nodeId, nodeObject: builtObject });
                }
            }).dxButton("instance"),
            "tagName": "button_confirm"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //button_decline
            "componentName": "dxButton",
            "instance": $("#button_decline").dxButton({
                disabled: true,
                type: "danger",
                template: `
                <span><img src="${icons.declineFile.type},${icons.declineFile.value}" width="65%"  /></span>
                <span>CANCELAR</span>
                `,
                focusStateEnabled: false,
                onClick: (event) => {
                    let nodeId = this._node_id;

                    this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "cleanAll")();
                    this._componentInstanceModel.getFunction("GLOBAL_CONFIG_FUNCTIONS", "enabledComponents")(false);
                    this._componentInstanceModel.getFunction("js_config_buttons_decline_confirm", "enabledComponents")(false);

                    this.onDeclineClick({ event, nodeId });
                }
            }).dxButton("instance"),
            "tagName": "button_decline"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_name
            "componentName": "dxTextBox",
            "instance": $('#text_name').dxTextBox({
                label: "Nome",
                disabled: true,
                labelMode: "static",
                onValueChanged: (event) => {

                }
            }).dxTextBox("instance"),
            "tagName": "text_name"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_description
            "componentName": "dxTextBox",
            "instance": $('#text_description').dxTextBox({
                label: "Descrição",
                disabled: true,
                labelMode: "static"
            }).dxTextBox("instance"),
            "tagName": "text_description",
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //select_type
            "componentName": "dxSelectBox",
            "instance": $("#select_type").dxSelectBox({
                dataSource: [{
                    "ID": "string",
                    "VALUE": "String"
                }, {
                    "ID": "number",
                    "VALUE": "Number"
                }, {
                    "ID": "integer",
                    "VALUE": "Integer"
                }, {
                    "ID": "object",
                    "VALUE": "Object"
                }, {
                    "ID": "array",
                    "VALUE": "Array"
                }, {
                    "ID": "boolean",
                    "VALUE": "Boolean"
                }, {
                    "ID": "enum",
                    "VALUE": "Enum"
                }],
                label: "Tipo",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: true,
                onValueChanged: (event) => {
                    let functions;

                    functions = this._componentInstanceModel.getFunction("js_dxBox_config_object_props");
                    functions.setVisible(event.value == "object");
                    functions.clearFields();

                    functions = this._componentInstanceModel.getFunction("js_dxBox_config_array_props");
                    functions.setVisible(event.value == "array");
                    functions.clearFields();

                    functions = this._componentInstanceModel.getFunction("js_dxBox_config_string_props");
                    functions.setVisible(event.value == "string");
                    functions.clearFields();

                    functions = this._componentInstanceModel.getFunction("js_dxBox_config_numeric_props");
                    functions.setVisible(["number", "integer"].includes(event.value));
                    functions.clearFields();

                    functions = this._componentInstanceModel.getFunction("js_dxBox_config_enum_props");
                    functions.setVisible(["enum", "string", "integer", "number"].includes(event.value));
                    functions.clearFields();
                }
            }).dxSelectBox("instance"),
            "tagName": "select_type"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_required
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_required").dxCheckBox({
                /* Default Value: false */
                text: 'Obrigatório',
                focusStateEnabled: false,
                disabled: true,
                iconSize: 20
            }).dxCheckBox("instance"),
            "tagName": "checkbox_required"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_nullable
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_nullable").dxCheckBox({
                text: 'Anulável',
                focusStateEnabled: false,
                iconSize: 20,
                disabled: true,
            }).dxCheckBox("instance"),
            "tagName": "checkbox_nullable"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_additional_properties
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_additional_properties").dxCheckBox({
                text: 'Propriedades adicionais',
                focusStateEnabled: false,
                iconSize: 20,
                disabled: false,
            }).dxCheckBox("instance"),
            "tagName": "checkbox_additional_properties"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_object_pattern_keys
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_object_pattern_keys").dxCheckBox({
                /* Default Value: false */
                text: 'Object pattern Keys',
                focusStateEnabled: false,
                disabled: false,
                iconSize: 20,
                onValueChanged: () => {
                    this._componentInstanceModel.disableEnableInstance("text_object_pattern_keys");
                    this._componentInstanceModel.clearInstanceValue("text_object_pattern_keys");
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_object_pattern_keys"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_object_pattern_keys
            "componentName": "dxTextBox",
            "instance": $('#text_object_pattern_keys').dxTextBox({
                label: "Pattern",
                disabled: true,
                labelMode: "static"
            }).dxTextBox("instance"),
            "tagName": "text_object_pattern_keys",
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //select_array_type
            "componentName": "dxSelectBox",
            "instance": $("#select_array_type").dxSelectBox({
                dataSource: [{
                    "ID": "string",
                    "VALUE": "String"
                }, {
                    "ID": "number",
                    "VALUE": "Number"
                }, {
                    "ID": "integer",
                    "VALUE": "Integer"
                }, {
                    "ID": "object",
                    "VALUE": "Object"
                }, {
                    "ID": "array",
                    "VALUE": "Array"
                }, {
                    "ID": "boolean",
                    "VALUE": "Boolean"
                }, {
                    "ID": "enum",
                    "VALUE": "Enum"
                }],
                label: "Tpo de array",
                valueExpr: "ID",
                displayExpr: "VALUE"
            }).dxSelectBox("instance"),
            "tagName": "select_array_type"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_array_min
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_array_min").dxCheckBox({
                text: 'Max/Min',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: (event) => {
                    this._componentInstanceModel.setInstanceValue("number_array_min", 0);

                    this._componentInstanceModel.disableEnableInstance("number_array_min");
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_array_min"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_array_min
            "componentName": "dxNumberBox",
            "instance": $("#number_array_min").dxNumberBox({
                disabled: true,
                label: "Min",
                labelMode: "static",
                min: 0
            }).dxNumberBox("instance"),
            "tagName": "number_array_min"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_array_max
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_array_max").dxCheckBox({
                text: 'Max/Min',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: (event) => {
                    this._componentInstanceModel.setInstanceValue("number_array_max", 0);

                    this._componentInstanceModel.disableEnableInstance("number_array_max");
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_array_max"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_array_max
            "componentName": "dxNumberBox",
            "instance": $("#number_array_max").dxNumberBox({
                disabled: true,
                label: "Max",
                labelMode: "static",
                min: 1
            }).dxNumberBox("instance"),
            "tagName": "number_array_max"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_array_unique_items
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_array_unique_items").dxCheckBox({
                /* Default Value: false */
                text: 'Apenas Itens únicos',
                focusStateEnabled: false,
                iconSize: 20
            }).dxCheckBox("instance"),
            "tagName": "checkbox_array_unique_items"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_string_regular_expression
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_string_regular_expression").dxCheckBox({
                text: 'Expressão regular',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: () => {
                    this._componentInstanceModel.disableEnableInstance("text_string_regular_expression");
                    this._componentInstanceModel.clearInstanceValue("text_string_regular_expression");
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_string_regular_expression"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_string_regular_expression
            "componentName": "dxTextBox",
            "instance": $('#text_string_regular_expression').dxTextBox({
                label: "Expressão",
                labelMode: "static",
                disabled: true
            }).dxTextBox("instance"),
            "tagName": "text_string_regular_expression"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_string_format
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_string_format").dxCheckBox({
                text: 'String format',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: () => {
                    this._componentInstanceModel.disableEnableInstance("select_string_format");
                    this._componentInstanceModel.clearInstanceValue("select_string_format");
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_string_format"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //select_string_format
            "componentName": "dxSelectBox",
            "instance": $("#select_string_format").dxSelectBox({
                dataSource: [
                    null,
                    {
                        "ID": "date-time",
                        "VALUE": "date-time"
                    }, {
                        "ID": "time",
                        "VALUE": "time"
                    }, {
                        "ID": "date",
                        "VALUE": "date"
                    }, {
                        "ID": "duration",
                        "VALUE": "duration"
                    }, {
                        "ID": "email",
                        "VALUE": "email"
                    }, {
                        "ID": "idn-email",
                        "VALUE": "idn-email"
                    }, {
                        "ID": "hostname",
                        "VALUE": "hostname"
                    }, {
                        "ID": "idn-hostname",
                        "VALUE": "idn-hostname"
                    }, {
                        "ID": "ipv4",
                        "VALUE": "ipv4"
                    }, {
                        "ID": "ipv6",
                        "VALUE": "ipv6"
                    }, {
                        "ID": "uuid",
                        "VALUE": "uuid"
                    }, {
                        "ID": "uri",
                        "VALUE": "uri"
                    }, {
                        "ID": "uri-reference",
                        "VALUE": "uri-reference"
                    }, {
                        "ID": "iri",
                        "VALUE": "iri"
                    }, {
                        "ID": "iri-reference",
                        "VALUE": "iri-reference"
                    }, {
                        "ID": "uri-template",
                        "VALUE": "uri-template"
                    }, {
                        "ID": "json-pointer",
                        "VALUE": "json-pointer"
                    }, {
                        "ID": "regex",
                        "VALUE": "regex"
                    }
                ],
                label: "Format",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: true,
            }).dxSelectBox("instance"),
            "tagName": "select_string_format"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_string_length_less
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_string_length_less").dxCheckBox({
                text: 'Tamanho mínimo',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: (event) => {
                    this._componentInstanceModel.disableEnableInstance("number_string_length_less", event.value);
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_string_length_less"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_string_length_less
            "componentName": "dxNumberBox",
            "instance": $("#number_string_length_less").dxNumberBox({
                label: "Valor",
                labelMode: "static",
                disabled: true,
                min: 1
            }).dxNumberBox("instance"),
            "tagName": "number_string_length_less"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_string_length_greater
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_string_length_greater").dxCheckBox({
                text: 'Tamanho máximo',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: (event) => {
                    this._componentInstanceModel.disableEnableInstance("number_string_length_greater", event.value);
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_string_length_greater"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_string_length_greater
            "componentName": "dxNumberBox",
            "instance": $("#number_string_length_greater").dxNumberBox({
                label: "Valor",
                labelMode: "static",
                disabled: true,
                min: 1
            }).dxNumberBox("instance"),
            "tagName": "number_string_length_greater"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //select_numeric_greater
            "componentName": "dxSelectBox",
            "instance": $("#select_numeric_greater").dxSelectBox({
                dataSource: [
                    null,
                    {
                        "ID": "maior_que",
                        "VALUE": "Maior que"
                    }, {
                        "ID": "maior_ou_igual",
                        "VALUE": "Maior ou igual"
                    }
                ],
                label: "Maior",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: false,
                onValueChanged: (event) => {
                    this._componentInstanceModel.clearInstanceValue("number_numeric_greater");
                    this._componentInstanceModel.disableEnableInstance("number_numeric_greater", !!event.value)
                }
            }).dxSelectBox("instance"),
            "tagName": "select_numeric_greater"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_numeric_greater
            "componentName": "dxNumberBox",
            "instance": $("#number_numeric_greater").dxNumberBox({
                /* Default Value: 0 */
                label: "Valor",
                labelMode: "static",
                disabled: true
            }).dxNumberBox("instance"),
            "tagName": "number_numeric_greater"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //checkbox_numeric_multiple
            "componentName": "dxCheckBox",
            "instance": $("#checkbox_numeric_multiple").dxCheckBox({
                text: 'Múltiplo',
                focusStateEnabled: false,
                iconSize: 20,
                onValueChanged: (event) => {
                    this._componentInstanceModel.disableEnableInstance("number_numeric_multiple", event.value);
                }
            }).dxCheckBox("instance"),
            "tagName": "checkbox_numeric_multiple"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_numeric_multiple
            "componentName": "dxNumberBox",
            "instance": $("#number_numeric_multiple").dxNumberBox({
                label: "Valor",
                labelMode: "static",
                disabled: true,
                min: 0.01
            }).dxNumberBox("instance"),
            "tagName": "number_numeric_multiple"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //select_numeric_less
            "componentName": "dxSelectBox",
            "instance": $("#select_numeric_less").dxSelectBox({
                dataSource: [
                    null,
                    {
                        "ID": "menor_que",
                        "VALUE": "Menor que"
                    }, {
                        "ID": "menor_ou_igual",
                        "VALUE": "Menor ou igual"
                    }
                ],
                label: "Menor",
                valueExpr: "ID",
                displayExpr: "VALUE",
                disabled: false,
                onValueChanged: (event) => {
                    this._componentInstanceModel.clearInstanceValue("number_numeric_less");
                    this._componentInstanceModel.disableEnableInstance("number_numeric_less", !!event.value)
                }
            }).dxSelectBox("instance"),
            "tagName": "select_numeric_less"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //number_numeric_less
            "componentName": "dxNumberBox",
            "instance": $("#number_numeric_less").dxNumberBox({
                label: "Valor",
                labelMode: "static",
                disabled: true
            }).dxNumberBox("instance"),
            "tagName": "number_numeric_less"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_enum_add_value
            "componentName": "dxTextBox",
            "instance": $('#text_enum_add_value').dxTextBox({
                /* Default Value: '' */
                label: "Valor",
                labelMode: "static"
            }).dxTextBox("instance"),
            "tagName": "text_enum_add_value"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //button_enum_add_value
            "componentName": "dxButton",
            "instance": $("#button_enum_add_value").dxButton({
                icon: `data:image/png;base64,${icons.addNoCircle.value}`,
                onClick: (event) => {
                    let textEnum = this._componentInstanceModel.getInstanceValue("text_enum_add_value");
                    if (!textEnum) { DevExpress.ui.notify("Campo Valor sem conteúdo!", 'error'); return; }

                    let listValues = this._componentInstanceModel.getInstanceValue("list_enum_values");
                    if (listValues.indexOf(textEnum) != -1) { DevExpress.ui.notify("Enum já cadastrado!", 'error'); return; }

                    this._componentInstanceModel.setInstanceValue("list_enum_values", listValues.concat(textEnum))
                    this._componentInstanceModel.clearInstanceValue("text_enum_add_value");
                }
            }).dxButton("instance"),
            "tagName": "button_enum_add_value"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //list_enum_values
            "componentName": "dxList",
            "instance": $('#list_enum_values').dxList({
                selectByClick: false,
                allowItemDeleting: true,
                itemDeleteMode: 'static'
            }).dxList('instance'),
            "tagName": "list_enum_values"
        }));

        $("#dxScroll_config").dxScrollView({
            direction: 'vertical'
        });
        // ==================================================================================================================== //


        // ===================================================== Functions ==================================================== //

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_config_main_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_config_main_props").show();
                    } else if (value == false) {
                        $("#js_config_main_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("text_name");
                    this._componentInstanceModel.clearInstanceValue("text_description");
                    this._componentInstanceModel.clearInstanceValue("select_type");
                    this._componentInstanceModel.clearInstanceValue("checkbox_required");
                    this._componentInstanceModel.clearInstanceValue("checkbox_nullable");
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("text_name", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("text_description", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("select_type", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_required", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_nullable", booleanValue);
                }
            },
            "tagName": "js_config_main_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_dxBox_config_object_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_dxBox_config_object_props").show();
                    } else if (value == false) {
                        $("#js_dxBox_config_object_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("checkbox_object_pattern_keys");
                    this._componentInstanceModel.clearInstanceValue("text_object_pattern_keys");
                    this._componentInstanceModel.clearInstanceValue("checkbox_additional_properties");
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("checkbox_additional_properties", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_object_pattern_keys", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("text_object_pattern_keys", booleanValue);
                }
            },
            "tagName": "js_dxBox_config_object_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_dxBox_config_array_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_dxBox_config_array_props").show();
                    } else if (value == false) {
                        $("#js_dxBox_config_array_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("select_array_type");
                    this._componentInstanceModel.clearInstanceValue("checkbox_array_max");
                    this._componentInstanceModel.clearInstanceValue("checkbox_array_min");
                    this._componentInstanceModel.clearInstanceValue("number_array_min");
                    this._componentInstanceModel.clearInstanceValue("number_array_max");
                    this._componentInstanceModel.clearInstanceValue("checkbox_array_unique_items");
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("select_array_type", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_array_min", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_array_max", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_array_min", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_array_max", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_array_unique_items", booleanValue);
                }
            },
            "tagName": "js_dxBox_config_array_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_dxBox_config_string_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_dxBox_config_string_props").show();
                    } else if (value == false) {
                        $("#js_dxBox_config_string_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("text_string_regular_expression");
                    this._componentInstanceModel.clearInstanceValue("checkbox_string_regular_expression");
                    this._componentInstanceModel.clearInstanceValue("checkbox_string_format");
                    this._componentInstanceModel.clearInstanceValue("select_string_format");
                    this._componentInstanceModel.clearInstanceValue("number_string_length_greater");
                    this._componentInstanceModel.clearInstanceValue("checkbox_string_length_greater");
                    this._componentInstanceModel.clearInstanceValue("number_string_length_less");
                    this._componentInstanceModel.clearInstanceValue("checkbox_string_length_less");
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("checkbox_string_regular_expression", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("text_string_regular_expression", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_string_format", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("select_string_format", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_string_length_greater", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_string_length_greater", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_string_length_less", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_string_length_less", booleanValue);
                }
            },
            "tagName": "js_dxBox_config_string_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_dxBox_config_numeric_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_dxBox_config_numeric_props").show();
                    } else if (value == false) {
                        $("#js_dxBox_config_numeric_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("select_numeric_greater");
                    this._componentInstanceModel.clearInstanceValue("select_numeric_less");
                    this._componentInstanceModel.clearInstanceValue("number_numeric_greater");
                    this._componentInstanceModel.clearInstanceValue("number_numeric_less");
                    this._componentInstanceModel.clearInstanceValue("checkbox_numeric_multiple");
                    this._componentInstanceModel.clearInstanceValue("number_numeric_multiple");

                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("select_numeric_greater", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("select_numeric_less", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_numeric_greater", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_numeric_less", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("number_numeric_multiple", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("checkbox_numeric_multiple", booleanValue);
                }
            },
            "tagName": "js_dxBox_config_numeric_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_dxBox_config_enum_props
            "functionDefinition": {
                setVisible: (value) => {
                    if (value == true) {
                        $("#js_dxBox_config_enum_props").show();
                    } else if (value == false) {
                        $("#js_dxBox_config_enum_props").hide();
                    }
                },
                clearFields: () => {
                    this._componentInstanceModel.clearInstanceValue("text_enum_add_value");
                    this._componentInstanceModel.clearInstanceValue("list_enum_values");
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("text_enum_add_value", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("list_enum_values", booleanValue);

                }
            },
            "tagName": "js_dxBox_config_enum_props"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //js_config_buttons_decline_confirm
            "functionDefinition": {
                setVisible: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    if (booleanValue) {
                        $("#js_config_buttons_decline_confirm").show();
                    } else {
                        $("#js_config_buttons_decline_confirm").hide();
                    }
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.disableEnableInstance("button_confirm", booleanValue);
                    this._componentInstanceModel.disableEnableInstance("button_decline", booleanValue);
                }
            },
            "tagName": "js_config_buttons_decline_confirm"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //GLOBAL_CONFIG_FUNCTIONS
            "functionDefinition": {
                configVisible: (visible) => {
                    if (typeof visible != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }

                    if (visible) {
                        this._componentInstanceModel.setVisibleInstance("btnHide");
                        this._componentInstanceModel.setInvisibleInstance("btnShow");
                        $("#jsDxScrollContent").show();
                        $("#js_Config").addClass('js-Config-show');
                        $("#js_Config").removeClass('js-Config-hide');
                    } else {
                        this._componentInstanceModel.setInvisibleInstance("btnHide");
                        this._componentInstanceModel.setVisibleInstance("btnShow");
                        $("#jsDxScrollContent").hide();
                        $("#js_Config").removeClass('js-Config-show');
                        $("#js_Config").addClass('js-Config-hide');
                    }
                },
                cleanAll: () => {
                    this._componentInstanceModel.getFunction("js_dxBox_config_array_props", "clearFields")();
                    this._componentInstanceModel.getFunction("js_dxBox_config_string_props", "clearFields")();
                    this._componentInstanceModel.getFunction("js_dxBox_config_numeric_props", "clearFields")();
                    this._componentInstanceModel.getFunction("js_dxBox_config_enum_props", "clearFields")();
                    this._componentInstanceModel.getFunction("js_dxBox_config_object_props", "clearFields")();
                    this._componentInstanceModel.getFunction("js_config_main_props", "clearFields")();
                },
                enabledComponents: (booleanValue) => {
                    if (typeof booleanValue != "boolean") {
                        throw new Error(`[ERRO]-[ConfigComponents] Parâmetro inválido.`);
                    }
                    this._componentInstanceModel.getFunction("js_config_main_props", "enabledComponents")(booleanValue);
                    this._componentInstanceModel.getFunction("js_config_buttons_decline_confirm", "enabledComponents")(booleanValue);
                }
            },
            "tagName": "GLOBAL_CONFIG_FUNCTIONS"
        }));
        // ==================================================================================================================== //
    }

}

export class HeaderComponents {
    _componentInstanceModel = new ComponentInstanceModel();

    /**
     * Evento de clique do botão Salvar em nova versão.
     * @param {object} event Evento de clique.
     * @returns {void}
     */
    btnSaveNewVersionClicked = (event) => { };

    /**
     * Instância do PopUpVersoes.
     * @type {PopUpVersoes}
     */
    _popUpVersoes;

    /**
     * Seta uma função na instância de PopUpVersoes para ser executada quando o conteúdo do popup iniciar a renderização.
     * @param {function} functionParam Função que deve ser executada.
     * @returns {void}
     */
    setPopUpVersoesGetContent = (functionParam) => {
        if (typeof functionParam != "function") {
            throw new Error("[Erro] - [HeaderComponents] - Parâmetro inválido setPopUpVersoesGetContent(functionParam) .")
        }
        this._popUpVersoes.popUpVersoesGetContent = functionParam;
    }

    /**
     * Seta uma função na instância de PopUpVersoes para ser executada quando a versão é clicada.
     * @param {function} functionParam Função que deve ser executada.
     * @returns {void}
     */
    setOnPopUpVersionClick = (functionParam) => {
        if (typeof functionParam != "function") {
            throw new Error("[Erro] - [HeaderComponents] - Parâmetro inválido setPopUpVersoesOnClick(functionParam) .")
        }
        this._popUpVersoes.onVersionClick = functionParam;
    }

    /**
     * Função popula os campos Id e Versão do header.
     * @param {object} param
     * @param {string} param.id Valor para o campo id do heade.
     * @param {string} param.numeroVersao Valor para Número da versão do header.
     */
    setHeaderinfo = ({ id, numeroVersao }) => {
        this._componentInstanceModel.setInstanceValue("text_header_id", id)
        this._componentInstanceModel.setInstanceValue("text_header_version", numeroVersao)
    }

    constructor() {
        this._componentInstanceModel.addInstance(new InstanceProps({ //text_header_version
            "componentName": "dxTextBox",
            "instance": $('#text_header_version').dxTextBox({
                label: "Versão",
                labelMode: "static",
                readOnly: true,
            }).dxTextBox("instance"),
            "tagName": "text_header_version"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //text_header_id
            "componentName": "dxTextBox",
            "instance": $('#text_header_id').dxTextBox({
                label: "ID",
                labelMode: "static",
                readOnly: true,
            }).dxTextBox("instance"),
            "tagName": "text_header_id"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //button_header_save_new_version
            "componentName": "dxButton",
            "instance": $('#button_header_save_new_version').dxButton({
                stylingMode: 'contained',
                text: 'Salvar em nova versão',
                type: 'success',
                onClick: (event) => {
                    this.btnSaveNewVersionClicked(event);
                }
            }).dxButton("instance"),
            "tagName": "button_header_save_new_version"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //button_header_select_version
            "componentName": "dxButton",
            "instance": $('#button_header_select_version').dxButton({
                stylingMode: 'contained',
                text: 'Selecionar versão',
                type: 'default',
                onClick: async (event) => {
                    this._popUpVersoes.showHidePopUp(true);
                }
            }).dxButton("instance"),
            "tagName": "button_header_select_version"
        }));

        this._popUpVersoes = new PopUpVersoes();

    }
}

export class ViewComponents {

    /**
     * @private
     */
    _componentInstanceModel = new ComponentInstanceModel();

    /**
     * instância da classe de construção do JsonView.
     * @type {JsonViewer}
    */
    jsonViewer = new JsonViewer();

    /**
     * instância da classe de construção do TreeView.
     * @type {TreeView}
    */
    treeView = new TreeView();


    /**
     * Busca a aba atual.
     * @returns {BaseTabModel} Informações da aba atual.
     */
    getCurrentTab = () => {
        return this._componentInstanceModel.getInstanceValue("tabTreeViewJsonSchema");
    }

    /**
     * Evento chamado quando a aba muda.
     * @param {BaseTabModel} dataSource Informações da aba atual.
     */
    onTabChanged = (dataSource) => { }

    constructor() {
        this._componentInstanceModel.addInstance(new InstanceProps({ //tabTreeViewJsonSchema
            "componentName": "dxTabs",
            "instance": $('#tabTreeViewJsonSchema').dxTabs({
                rtlEnabled: false,
                selectedIndex: 0,
                showNavButtons: false,
                focusStateEnabled: false,
                dataSource: [
                    new BaseTabModel({
                        id: "treeView",
                        text: 'Tree View',
                        icon: 'hierarchy',
                    }),
                    new BaseTabModel({
                        id: "jsonRendererContainer",
                        text: 'Json Schema View',
                        icon: "codeblock",
                    }),
                ],
                orientation: "horizontal",
                stylingMode: "secondary",
                iconPosition: "start",
                onItemClick: ({ itemData }) => {
                    this.onTabChanged(itemData);
                    this._componentInstanceModel.getFunction("show_hide_jsonView_treeview")(itemData);
                }
            }).dxTabs('instance'),
            "tagName": "tabTreeViewJsonSchema"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //show_hide_jsonView_treeview
            "functionDefinition": (itemData) => {
                if (itemData.id == "treeView") {
                    $("#treeView").show();
                    $("#jsonRendererContainer").hide();
                } else {
                    $("#jsonRendererContainer").show();
                    $("#treeView").hide();
                }
            },
            "tagName": "show_hide_jsonView_treeview"
        }));
    }
}

class TreeView {
    /**
     * @private
     */
    _componentInstanceModel = new ComponentInstanceModel();
    /**
     * Itens atuais do treeView
     * @type {Array<BaseNodeModel>}
     * @private 
     */
    _items = [];

    /**
     * Evento chamado quando um node é clicado.
     * @param {object} param
     * @param {object} param.component componente DevExtreme clicado.
     * @param {object} param.element componente HTML clicado.
     * @param {object} param.event evento de clique.
     * @param {BaseNodeModel} param.itemData Informaçoes do node clicado.
     * @param {object} param.itemElement Informações do componente DeveExreme clicado.
     * @param {integer} param.itemIndex Index do item clicado.
     * @param {object} param.node Informações do node clicado na estrutura do DevExtreme.
     * @returns {void}
     */
    onNodeClicked = ({ component, element, event, itemData, itemElement, itemIndex, node }) => { };

    /**
     * Função remove o item com id igual a 'nodeIdParam' e todos os itens abaixo dele.
     * @param {String} nodeIdParam id do item que deve ser removido.
     * @param {Array<BaseNodeModel>} itemsParam Array dos itens atuais.
     * @returns {Array<BaseNodeModel>} Array de itens restantes.
     * @private
     */
    _removeCascade = (nodeIdParam, itemsParam) => {
        let itensFilhos = itemsParam.filter(VALUE => (VALUE.id_ref == nodeIdParam));
        let remainingItems = itemsParam.filter(VALUE => (VALUE.id_ref != nodeIdParam && VALUE.id != nodeIdParam));
        for (let ITEM of itensFilhos) {
            remainingItems = this._removeCascade(ITEM.id, remainingItems);
        }
        return remainingItems;
    }

    /**
     * Função faz a revisão das regras específicas de cada tipo de node.
     * @param {Array<BaseNodeModel>} itemsParam 
     * @returns {Array<BaseNodeModel>}
     * @private
     */
    _reviewItemsProps = (itemsParam) => {
        /**
         * Função procura um 'ARRAY_ELEMENT' filho do item 'itemParam'
         * @param {Array<BaseNodeModel>} itensArrayParam 
         * @param {BaseNodeModel} itemParam 
         * @returns {BaseNodeModel | null}
         */
        const findArrayElement = (itensArrayParam, itemParam) => {
            return itensArrayParam.find(VALUE => VALUE.id_ref == itemParam.id && VALUE.node_value.text_name == "ARRAY_ELEMENT");
        }

        /**
         * Função que valida e aplica as regras dos itens do tipo array.
         * @param {Array<BaseNodeModel>} itemsArrayParam 
         * @returns {Array<BaseNodeModel>}
         */
        const reviewArrayItems = (itemsArrayParam) => {
            let finalItems = itemsArrayParam;

            /* Valida se os itens 'ARRAY_ELEMENT' são do tipo definido no item pai. */
            /* Quando um item 'ARRAY_ELEMENT' tem o campo 'Tipo' diferente do campo 'Tipo de Array' do elemento pai, ele é excluído */
            finalItems = ((param) => {
                let itemsArray = param;

                let arrayItems = itemsArray.filter(VALUE => VALUE.node_value.select_type == 'array');
                for (let ITEM of arrayItems) {
                    let arrayElement = findArrayElement(itemsArray, ITEM);
                    if (arrayElement && arrayElement.node_value.select_type != ITEM.node_value.select_array_type) {
                        itemsArray = this._removeCascade(arrayElement.id, itemsArray);
                    }
                }

                return itemsArray;
            })(finalItems)

            /* Valida se todos os itens do tipo 'array' possuem seu filho 'ARRAY_ELEMENT' */
            finalItems = ((param) => {
                let itemsArray = param;

                let arrayItems = itemsArray.filter(VALUE => VALUE.node_value.select_type == 'array');
                for (let ITEM of arrayItems) {
                    let arrayElement = findArrayElement(itemsArray, ITEM);
                    if (!arrayElement) {
                        itemsArray.push((() => {
                            let instanceValue = new BaseNodeModel(ITEM.id);
                            instanceValue.text = "ARRAY ELEMENT";
                            instanceValue.node_value.text_name = "ARRAY_ELEMENT";
                            instanceValue.node_value.text_description = "ARRAY ELEMENT";
                            instanceValue.node_value.select_type = ITEM.node_value.select_array_type;
                            return instanceValue;
                        })());
                    }
                }

                return itemsArray;
            })(finalItems)

            /* Valida se o componente do tipo 'array' tem apenas o item 'ARRAY_ELEMENT' como filho  */
            finalItems = ((param) => {
                let itemsArray = param;
                let arrayItems = itemsArray.filter(VALUE => VALUE.node_value.select_type == 'array');
                for (let ITEM of arrayItems) {
                    let itensFilhoNaoArrayItem = itemsArray.filter(VALUE => VALUE.id_ref == ITEM.id && VALUE.node_value.text_name != "ARRAY_ELEMENT");
                    itensFilhoNaoArrayItem.forEach(VALUE => {
                        itemsArray = this._removeCascade(VALUE.id, itemsArray);
                    });
                }
                return itemsArray;
            })(finalItems)

            return finalItems;
        };

        /**
        * Função que valida e aplica as regras dos itens do tipo object.
        * @param {Array<BaseNodeModel>} itemsArrayParam 
        * @returns {Array<BaseNodeModel>}
        */
        const reviewObjectItems = (itemsArrayParam) => {
            let finalItems = itemsArrayParam;

            /* Remove os itens 'ARRAY_ELEMENT' filhos de um item 'object' */
            finalItems = ((param) => {
                let itensArray = param;

                let objectItens = itensArray.filter(VALUE => VALUE.node_value.select_type == "object");
                for (let ITEM of objectItens) {
                    let arrayElement = findArrayElement(itensArray, ITEM);
                    if (arrayElement) {
                        itensArray = this._removeCascade(arrayElement.id, itensArray);
                    }
                }
                return itensArray;
            })(finalItems);

            return finalItems;
        }

        /**
         * Função que valida e aplica as regras dos outros itens. 
         * @param {Array<BaseNodeModel>} itemsArrayParam 
         */
        const reviewOthers = (itemsArrayParam) => {
            let finalItems = itemsArrayParam;

            /* Remove itens filhos de componentes básicos */
            finalItems = ((param) => {

                let itensArray = param;
                let objectItens = itensArray.filter(VALUE => ["string", "integer", "number", "enum", "boolean"].includes(VALUE.node_value.select_type));

                for (let ITEM of objectItens) {
                    let childItens = itensArray.filter(VALUE => VALUE.id_ref == ITEM.id);
                    for (let CHILD of childItens) {
                        itensArray = this._removeCascade(CHILD.id, itensArray);
                    }
                }
                return itensArray;
            })(finalItems);

            /* Cria um componente raiz se não tiver nodes. */
            finalItems = ((param) => {
                if (param.length == 0) {
                    let instanceValue = new BaseNodeModel(null);
                    instanceValue.text = "root";
                    instanceValue.node_value.text_name = "root";
                    instanceValue.node_value.text_description = "root";
                    instanceValue.node_value.select_type = "object";
                    instanceValue.node_value.checkbox_required = true;
                    return [instanceValue];
                }
                return param;
            })(finalItems)

            return finalItems;
        }

        let finalItems = itemsParam;
        finalItems = reviewArrayItems(finalItems);
        finalItems = reviewObjectItems(finalItems);
        finalItems = reviewOthers(finalItems);

        /**
         * Percore todos os itens e define se pode ter as propriedades de adicionar, remover e expandir.
         * @returns {Array<BaseNodeModel>}
         */
        finalItems = finalItems.map(VALUE => {
            let item = VALUE;

            switch (item.node_value.select_type) {
                case "object":
                    item.contextAddBtn = true;
                    item.contextRemoveBtn = true;
                    item.expanded = true;
                    break;
                case "array":
                    item.contextAddBtn = false;
                    item.contextRemoveBtn = true;
                    item.expanded = false;
                    break;
                case "string":
                case "integer":
                case "number":
                case "enum":
                case "boolean":
                    item.contextAddBtn = false;
                    item.contextRemoveBtn = true;
                    item.expanded = false;
                    break;
                default:
                    item.contextAddBtn = false;
                    item.contextRemoveBtn = false;
                    item.expanded = false;
            }

            if (item.node_value.text_name == "ARRAY_ELEMENT") {
                item.contextAddBtn = item.node_value.select_type == "object" ? true : false;
                item.contextRemoveBtn = false;
                item.expanded = false;
            }

            return item;
        });

        return finalItems;
    }

    validCurrentItems = () => {
        let itensSemTipo = this._items.filter(VALUE => !VALUE.node_value.select_type);
        let arraySemSubTipo = this._items.filter(VALUE => VALUE.node_value.select_type == "array" && !VALUE.node_value.select_array_type);

        if (itensSemTipo.length > 0) {
            this._scrollFocusItem(itensSemTipo[0].id);
            DevExpress.ui.notify(`Item sem tipo definido.`, 'error');
            return false;
        }

        if (arraySemSubTipo.length > 0) {
            this._scrollFocusItem(arraySemSubTipo[0].id);
            DevExpress.ui.notify(`Array sem subtipo definido.`, 'error');
            return false;
        }
        return true;
    }

    /**
     * Função que seta os itens e atualiza o treeView.
     * @param {Array<BaseNodeModel>} items
     * @returns {void}
     * @private
     */
    setItems = (items) => {
        let value = this._reviewItemsProps(items);
        this._items = value;
        this._componentInstanceModel.setInstanceValue("treeView", value);
    }

    /**
     * Retorna os itens atuais da treeview.
     * @returns {Array<BaseNodeModel>}
     */
    getItems = () => {
        return this._items;
    }

    /**
     * Limpa a view.
     * @returns {void}
     */
    clearItems = () => {
        this._items = [];
        this._componentInstanceModel.setInstanceValue("treeView", []);
    }

    /**
     * Move o scroll para o item com o id passado.
     * @private
     * @param {string} nodeId id do node.
     * @returns {void}
     */
    _scrollFocusItem = (nodeId) => {
        let instanceProps = this._componentInstanceModel.getInstanceProps("treeView");
        let instance = instanceProps.getInstance();
        instance.scrollToItem(nodeId);
    }

    /**
     * Atualiza um node com base no nodeId
     * @param {string} param.nodeId - ID do node que deve ser atualizado.
     * @param {BaseNodeModel} param.nodeObject - Valor para atualizar.
     */
    updateItem = ({ nodeId, nodeObject }) => {

        let copyItems = JSON.parse(JSON.stringify(this._items));

        for (let INDEX in copyItems) {
            if (copyItems[INDEX].id == nodeId) {
                copyItems[INDEX].node_value = nodeObject;
                copyItems[INDEX].text = nodeObject.text_description;
                break;
            }
        }

        this.setItems(copyItems);
        this._scrollFocusItem(nodeId);
    }

    /**
     * Função executa o build do JsonSchema.
     * @returns {object} JsonSchema final
     */
    buildJsonSchema = () => {
        if (!this.validCurrentItems()) { return {}; }

        let treeViewInstance = this._componentInstanceModel.getInstanceProps("treeView");
        treeViewInstance = treeViewInstance.getInstance();
        let hierarchyItems = treeViewInstance.getNodes();

        const jsonSchemaBuilder = new JsonSchemaBuilder(hierarchyItems);
        return jsonSchemaBuilder.buildJsonSchema();
    }

    constructor() {
        this._componentInstanceModel.addFunction(new FunctionProps({ //btnAddClicked
            "functionDefinition": (event) => {
            },
            "tagName": "btnAddClicked"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //nodeLessButtonClicked
            "functionDefinition": (event) => {
                let remainingItems = this._removeCascade(event.itemNodeId, this._items);
                this.setItems(remainingItems);
            },
            "tagName": "nodeLessButtonClicked"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //nodeAddButtonClicked
            "functionDefinition": (event) => {
                let items = JSON.parse(JSON.stringify(this._items));
                let newItem = new BaseNodeModel(event.itemNodeId)
                items.push(newItem);
                this.setItems(items);
                this._scrollFocusItem(newItem.id);
            },
            "tagName": "nodeAddButtonClicked"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //builtItemTemplate
            "functionDefinition": (data, index, element) => {
                let iconProp = (() => {
                    if (data.node_value.select_type) {
                        return icons[data.node_value.select_type];
                    }
                    return icons["blankFile"];
                })();

                return `
                    <div id="node_${data.id}">
                        <img src="${iconProp.type},${iconProp.value}" width="35" height="35" />
                        <span>${data.text}</span>
                    </div>
                    <div id="nodeContext_${data.id}" ></div>
                `;
            },
            "tagName": "builtItemTemplate"
        }));

        this._componentInstanceModel.addFunction(new FunctionProps({ //itemRendered
            "functionDefinition": ({ itemData }) => {
                let self = this;

                self._componentInstanceModel.addInstance(new InstanceProps({
                    "componentName": "dxContextMenu",
                    "instance": $(`#nodeContext_${itemData.id}`).dxContextMenu({
                        dataSource: [
                            { "text": "", "id": "addBtn", "icon": "plussBtnIcon", "color": "#8BC34A", "disabled": !itemData.contextAddBtn, "itemNodeId": itemData.id },
                            { "text": "", "id": "removeBtn", "icon": "lessBtnIcon", "color": "#F44336", "disabled": !itemData.contextRemoveBtn, "itemNodeId": itemData.id }
                        ],
                        width: 30,
                        target: `#node_${itemData.id}`,
                        itemTemplate: (itemData) => {
                            let iconProp = icons[itemData.icon];
                            return `
                                    <img src="${iconProp.type},${iconProp.value}" width="25" height="25" style="background-color: ${itemData.color}; border-radius: 50%;"/>
                            `;
                        },
                        onItemClick({ itemData }) {
                            if (itemData.id == "addBtn") {
                                self._componentInstanceModel.getFunction("nodeAddButtonClicked")(itemData);
                            } else if (itemData.id == "removeBtn") {
                                self._componentInstanceModel.getFunction("nodeLessButtonClicked")(itemData);
                            }
                        },
                    }).dxContextMenu("instance"),

                }));
            },
            "tagName": "itemRendered"
        }));

        this._componentInstanceModel.addInstance(new InstanceProps({ //treeView
            "componentName": "dxTreeView",
            "instance": $('#treeView').dxTreeView({
                items: this._items,
                dataStructure: 'plain',
                parentIdExpr: 'id_ref',
                keyExpr: 'id',
                displayExpr: 'text',
                itemTemplate: this._componentInstanceModel.getFunction("builtItemTemplate"),
                onItemRendered: this._componentInstanceModel.getFunction("itemRendered"),
                onItemClick: (props) => { this.onNodeClicked(props); },
            }).dxTreeView('instance'),
            "tagName": "treeView"
        }));

        this.setItems([]);
    }
}

class JsonViewer {
    /**
     * json atual da view.
     * @private
     */
    _json;


    /**
     * Define o json do jsonViewer.
     * @param {object} json
     * @throws {Error} Parâmetro json não é um objeto ou não foi passado.
     */

    setJson = (json) => {
        if (!json || typeof json != "object") { throw new Error(`[ERRO]-[JsonViewer] Parametro inválido.`); }
        this._json = json;
        this._updateJsonView();
    }

    /**
     * Limpa o json da view.
     * @returns {void}
     */
    clearJson = () => {
        this._json = "";
        this._updateJsonView();
    }

    /**
     * Atualiza o DOM com o json e as opçoes atuais.
     * @private
     */
    _updateJsonView = () => {
        let jsonViewrIframe = $("#JsonViewerIframe");
        if (jsonViewrIframe.length) {
            let setJson = jsonViewrIframe[0].contentWindow.setJson;
            setJson(JSON.stringify(this._json));
        }
    }


    constructor() { }
}

class JsonSchemaBuilder {
    /**
     * Itens do treeview organizados em hierarquia.
     * @type {object}
     */
    _hierarchyItems;

    /**
     * Objecto com funções para montar as propriedades de cada tipo no jsonSchema.
     * @type {object}
     */
    _buildByType = {
        "object": (nodeValue, children) => {
            let finalObject = {
                "type": ["object"],
                "description": nodeValue.text_description,
                "properties": {},
                "additionalProperties": nodeValue.checkbox_additional_properties,
                "required": []
            }

            if (nodeValue.checkbox_object_pattern_keys) {
                finalObject["propertyNames"] = {
                    "pattern": nodeValue.text_object_pattern_keys
                };
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            for (let CHILD of children) {
                let inNodeValue = CHILD.itemData.node_value;
                let inSelectType = inNodeValue.select_type;
                let inChildren = CHILD.children;

                finalObject.properties[inNodeValue.text_name] = this._buildByType[inSelectType](inNodeValue, inChildren);

                if (inNodeValue.checkbox_required) {
                    finalObject.required.push(inNodeValue.text_name);
                }
            }

            return finalObject;
        },
        "string": (nodeValue) => {
            let finalObject = {
                "type": ["string"],
                "description": nodeValue.text_description,
            }

            if (nodeValue.checkbox_string_regular_expression) {
                finalObject.pattern = nodeValue.text_string_regular_expression
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            if (nodeValue.checkbox_string_format) {
                finalObject.format = nodeValue.select_string_format;
            }

            if (nodeValue.checkbox_string_length_greater) {
                finalObject.maxLength = nodeValue.number_string_length_greater;
            }

            if (nodeValue.checkbox_string_length_less) {
                finalObject.minLength = nodeValue.number_string_length_less;
            }

            if (nodeValue.list_enum_values.length > 0) {
                finalObject.enum = nodeValue.list_enum_values;
            }
            return finalObject;
        },
        "integer": (nodeValue) => {
            let finalObject = {
                "type": ["integer"],
                "description": nodeValue.text_description,
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            if (nodeValue.checkbox_numeric_multiple) {
                finalObject.multipleOf = nodeValue.number_numeric_multiple
            }


            if (nodeValue.select_numeric_greater) {
                if (nodeValue.select_numeric_greater == "maior_que") {
                    finalObject.exclusiveMinimum = nodeValue.number_numeric_greater;
                } else {
                    finalObject.minimum = nodeValue.number_numeric_greater;
                }
            }

            if (nodeValue.select_numeric_less) {
                if (nodeValue.select_numeric_less == "menor_que") {
                    finalObject.exclusiveMaximum = nodeValue.number_numeric_less;
                } else {
                    finalObject.maximum = nodeValue.number_numeric_less;
                }
            }

            if (nodeValue.list_enum_values.length > 0) {
                let items = nodeValue.list_enum_values.map(VALUE => isNaN(Number(VALUE)) ? null : Number(VALUE)).filter(VALUE => VALUE != null);
                if (items.length > 0) {
                    finalObject.enum = items;
                }
            }
            return finalObject;
        },
        "number": (nodeValue) => {
            let finalObject = {
                "type": ["number"],
                "description": nodeValue.text_description,
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            if (nodeValue.checkbox_numeric_multiple) {
                finalObject.multipleOf = nodeValue.number_numeric_multiple
            }


            if (nodeValue.select_numeric_greater) {
                if (nodeValue.select_numeric_greater == "maior_que") {
                    finalObject.exclusiveMinimum = nodeValue.number_numeric_greater;
                } else {
                    finalObject.minimum = nodeValue.number_numeric_greater;
                }
            }

            if (nodeValue.select_numeric_less) {
                if (nodeValue.select_numeric_less == "menor_que") {

                    finalObject.exclusiveMaximum = nodeValue.number_numeric_less;
                } else {

                    finalObject.maximum = nodeValue.number_numeric_less;
                }
            }

            if (nodeValue.list_enum_values.length > 0) {
                let items = nodeValue.list_enum_values.map(VALUE => isNaN(Number(VALUE)) ? null : Number(VALUE)).filter(VALUE => VALUE != null);
                if (items.length > 0) {
                    finalObject.enum = items;
                }
            }
            return finalObject;
        },
        "array": (nodeValue, children) => {
            let finalObject = {
                "type": ["array"],
                "description": nodeValue.text_description,
                "items": (() => {
                    let inNodeValue = children[0].itemData.node_value;
                    let inSelectType = inNodeValue.select_type;
                    let inChildren = children[0].children;

                    return this._buildByType[inSelectType](inNodeValue, inChildren);
                })()
            }

            if (nodeValue.checkbox_array_min) {
                finalObject.minItems = nodeValue.number_array_min
            }

            if (nodeValue.checkbox_array_max) {
                finalObject.maxItems = nodeValue.number_array_max;
            }

            if (nodeValue.checkbox_array_unique_items) {
                finalObject.uniqueItems = true;
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            return finalObject;
        },
        "boolean": (nodeValue) => {
            let finalObject = {
                "type": ["boolean"],
                "description": nodeValue.text_description,
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            return finalObject;
        },
        "enum": (nodeValue) => {
            let finalObject = {
                "type": ["string"],
                "description": nodeValue.text_description,
                "enum": nodeValue.list_enum_values
            }

            if (nodeValue.checkbox_nullable) {
                finalObject.type.push("null");
            }

            return finalObject;
        }
    }

    /**
     * Função faz a montagem do jsonSchema.
     * @returns {object} JsonSchema final.
     */
    buildJsonSchema = () => {
        if (this._hierarchyItems.length == 0) { return {} }

        let finalObject = {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "$id": GUID.getGUID(),
            "title": this._hierarchyItems[0].text,
            "description": this._hierarchyItems[0].text,
            ...(() => {
                let nodeValue = this._hierarchyItems[0].itemData.node_value;
                let selectType = nodeValue.select_type;
                let children = this._hierarchyItems[0].children;

                return this._buildByType[selectType](nodeValue, children);
            })()
        }
        return finalObject;
    }

    constructor(hierarchyItems) {
        this._hierarchyItems = Array.isArray(hierarchyItems) ? hierarchyItems : [];
    }
}

class PopUpVersoes {
    /**
    * @private
    */
    _componentInstanceModel = new ComponentInstanceModel();

    /**
     * Instância do conteúdo atual do popup
     * @type {HTMLElement}
     * @private
     */
    _popUpContent;

    /**
     * Número da página atual do popup.
     * @type {integer}
     * @private
     */
    _popUpCurrentContentPage;

    /**
     * Número da página padrão do popup.
     * @type {integer}
     * @private
     */
    _popUpDefaultContentPage = 1;

    /**
     * Take atual do popup.
     * @type {integer}
     * @private
     */
    _popUpCurrentTakeContentePage;

    /**
     * Take padrão do popup.
     * @type {integer}
     * @private
     */
    _popUpDefaultTakeContentePage = 10;

    /**
     * Count atual do conteúdo do popup.
     * @type {integer}
     * @private
     */
    _popUpCurrentCountContentePage = 0;

    /**
     * Conteúdo inicial do popup.
     * @type {string}
     * @private
     */
    _popUpMainContent = `
        <div id="popup_select_version_content" class="popup-select-version-content">
        </div>
    `;

    /**
     * Função fornecida para a busca de conteúdo que deve ser renderizado no popup.
     * @param {integer} page 
     * @param {integer} take 
     * @returns {Array<object>}
     */
    popUpVersoesGetContent = async (page, take) => { return [] };

    /**
     * Função executada quando o popup busca o conteúdo que deve ser apresentado.
     * @param {integer} page 
     * @param {integer} take 
     * @returns {Array<object>}
     * @private
     */
    _popUpVersoesGetContent = async (page, take) => {
        let result = await this.popUpVersoesGetContent(page, take);
        if (this._validDataArrayContent(result)) {
            return result
        }
        return [];
    };

    /**
     * Função fornecida para ser executada quando a versão do popup é clacada.
     * @param {string} id 
     */
    onVersionClick = (id) => { }

    /**
     * Função executada quando uma versão do popup é clicada.
     * @param {string} id 
     * @private
     */
    _onVersionClick = (id) => {
        this.onVersionClick(id);
        this.showHidePopUp(false);
    }

    /**
     * Função mostra ou esconde o popup.
     * @param {boolean} value 
     * @private
     */
    _showHideLoading = (value) => {
        this._cleanContent();
        if (value) {
            $(`<div id="popup_select_version_loading"</div>`).dxLoadIndicator({
                height: 60,
                width: 60,
                visible: true
            }).appendTo(this._popUpContent);
        } else {
            $("#popup_select_version_loading").remove();
        }
    }

    /**
     * Função valida se o array está no formato esperado.
     * @param {Array<object>} dataArray 
     * @returns {boolean}
     * @private
     */
    _validDataArrayContent = (dataArray) => {
        let valid = true;

        if (typeof dataArray != 'object') {
            valid = false;
        } else if (!dataArray.count || typeof dataArray.count != "number") {
            valid = false;
        } else if (!dataArray.data || !Array.isArray(dataArray.data)) {
            valid = false;
        } else {
            for (let ITEM of dataArray.data) {
                let dataCriacaoValid = (() => {
                    if (typeof ITEM.dataCriacao != "string") { return false }
                    let date = new Date(ITEM.dataCriacao);
                    return date == "Invalid Date" ? false : true;
                })();

                let idValid = ["string", "number"].includes(typeof ITEM.id);

                let numeroVersao = typeof ITEM.numeroVersao == "number";

                valid = dataCriacaoValid && idValid && numeroVersao;
            }
        }

        if (!valid) {
            console.warn([
                "[AVISO] - [HeaderComponents] Valore para PopUp de versão inválido. Dado esperado:",
                `{`,
                `  "count": int,`,
                `  "data": [{`,
                `      "id": string,`,
                `      "dataCriacao": string,`,
                `      "numeroVersao": int`,
                `  }]`,
                `}`
            ].join("\n"));
        }

        return valid;
    }

    /**
     * Monta o conteúdo do popup.
     * @param {Array<object>} data;
     * @returns {void}
     * @private
     */
    _setContent = (data) => {
        let popUpCardContainer = $(`
            <div class="popup-card-container" id="popUpCardContainer">
            </div>
        `);

        if (data.length > 0) {
            popUpCardContainer.append(data.map(VALUE => {
                let component = $(`
                <div class="card" onClick="">
                    <div class="card-priority priority-1"></div>
                    <div class="card-subject">Versão: V${VALUE.numeroVersao}</div>
                    <div class="card-subject">Data: ${new Date(VALUE.dataCriacao).toLocaleDateString("pt-BR")}</div>
                    <div class="card-assignee">ID: ${VALUE.id}</div>
                </div> 
                `).on("click", () => this._onVersionClick(VALUE.id));

                return component;
            }));
        } else {
            popUpCardContainer.append(`<span>SEM CONTEÚDO.</span>`)
        }

        popUpCardContainer.appendTo(this._popUpContent);

        $("#popUpCardContainer").dxScrollView({
            direction: 'vertical'
        });
    }

    /**
     * Limpa o conteúdo do popup.
     * @returns {void}
     * @private
     */
    _cleanContent = () => {
        this._popUpContent.empty();
    }

    /**
     * Inicia o conteúdo do popUp e faz a paginação.
     * @param {"NEXT"|"PREVIOUS"|null} pageAction 
     * @private
     */
    _initPopUpContent = async (pageAction/* NEXT / PREVIOUS / NULL */) => {

        this._cleanContent();
        this._showHideLoading(true);

        let dataResult;
        if (!pageAction) {
            this._popUpCurrentContentPage = this._popUpDefaultContentPage;
            this._popUpCurrentTakeContentePage = this._popUpDefaultTakeContentePage;

            dataResult = await this._popUpVersoesGetContent(this._popUpCurrentContentPage, this._popUpCurrentTakeContentePage);
        } else if (pageAction == "NEXT") {
            dataResult = await this._popUpVersoesGetContent(this._popUpCurrentContentPage + 1, this._popUpCurrentTakeContentePage);
            this._popUpCurrentContentPage = this._popUpCurrentContentPage + 1;
        } else if (pageAction == "PREVIOUS") {
            dataResult = await this._popUpVersoesGetContent(this._popUpCurrentContentPage - 1, this._popUpCurrentTakeContentePage);
            this._popUpCurrentContentPage = this._popUpCurrentContentPage - 1;
        }

        this._popUpCurrentCountContentePage = dataResult.count;
        this._cleanContent();
        this._setContent(dataResult.data);
    }

    /**
     * Função acionada quando o popup deve ser renderizado.
     * @param {boolean} value 
     */
    showHidePopUp = async (value) => {
        this._componentInstanceModel.setInstanceValue("popup_select_version", value);
        if (value) {
            await this._initPopUpContent(null);
        }
    }

    constructor() {
        let self = this;

        this._componentInstanceModel.addInstance(new InstanceProps({ //popup_select_version
            "componentName": "dxPopup",
            "instance": $('#popup_select_version').dxPopup({
                width: 500,
                height: 500,
                visible: false,
                title: 'Versões',
                container: ".js-content",
                hideOnOutsideClick: false,
                showCloseButton: true,
                enableBodyScroll: false,
                resizeEnabled: false,
                contentTemplate: () => {
                    let content = $(this._popUpMainContent);
                    this._popUpContent = content;
                    return content;
                },
                toolbarItems: [{ /* Voltar */
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'left',
                    options: {
                        icon: 'chevrondoubleleft',
                        stylingMode: 'contained',
                        async onClick() {
                            if (self._popUpCurrentContentPage == 1) { return }
                            await self._initPopUpContent("PREVIOUS");
                        },
                    },
                }, { /* Avançar */
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'left',
                    options: {
                        icon: 'chevrondoubleright',
                        stylingMode: 'contained',
                        async onClick() {
                            let maxPage = Number((self._popUpCurrentCountContentePage / self._popUpCurrentTakeContentePage).toFixed(0));
                            if (maxPage == self._popUpCurrentContentPage || maxPage == 0) { return }
                            await self._initPopUpContent("NEXT");
                        },
                    },
                }]
            }).dxPopup('instance'),
            "tagName": "popup_select_version"
        }));
    }

}
