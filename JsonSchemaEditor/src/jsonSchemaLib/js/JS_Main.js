import { BaseNodeModel, BaseNodeValueModel, BaseTabModel } from "./BaseModels.js";
import { ConfigComponents, HeaderComponents, ViewComponents } from "./JSComponents.js";


const main = async () => {

    /**
     * Instância da classe responsável pelos compoentes do painel de configurações dos nodes.
     * @type {ConfigComponents}
     */
    const configComponents = new ConfigComponents();

    /**
     * Instância responsável pelos compoentes do header.
     * @type {HeaderComponents}
     */
    const headerComponents = new HeaderComponents();

    /**
     * Instância responsável pelos componentes de view.
     * @type {ViewComponents}
     */
    const viewComponents = new ViewComponents();

    /**
     * Função desponibilizada no window para a definição dos itens do treeview.
     * @param {Array<BaseNodeModel>} items 
     * @param {String} numeroVersao 
     * @param {String} id 
     * @throws Lança erro se items não for um array ou não for passado.
     * @throws Lança erro se numeroVersao não for string ou number.
     * @throws Lança erro se id não for string ou number.
     */
    window.setItems = (items, numeroVersao, id) => {
        if (!Array.isArray(items) || items.length == 0) {
            throw new Error("[Erro] - [main] - parâmetro 'items' da função setItems inválido.")
        }
        if (["number", "string"].includes(typeof numeroVersao)) {
            throw new Error("[Erro] - [main] - parâmetro 'numeroVersao' da função setItems inválido. \n Esperado Number ou String");
        }
        if (["number", "string"].includes(typeof id)) {
            throw new Error("[Erro] - [main] - parâmetro 'id' da função setItems inválido. \n Esperado Number ou String");
        }

        headerComponents.setHeaderinfo({
            "id": id,
            "numeroVersao": numeroVersao.toString()
        });
        viewComponents.treeView.setItems(items);
    };

    /**
     * Ação executada quando o botão 'Salvar em nova versão' é clicado.
     * 
     * Função executa envia como parâmetro o treeview, id do schema e o schema montado.
     * 
     * Função busca no window uma função fornecida pela aplicação com o nome de 'onBtnSaveClick'. Caso não encontrada, nada acontece e um aviso é lançado.
     * @returns {void}
     */
    headerComponents.btnSaveNewVersionClicked = async () => {
        let functionParam = (() => {
            let func = window.onBtnSaveClick;
            if (!func) {
                console.warn("[AVISO] -  [MAIN] Função onBtnSaveClick não fornecida.");
            } else {
                return func;
            }
            return async () => { }
        })();

        if (!viewComponents.treeView.validCurrentItems()) { return; }

        let builtJsonSchema = viewComponents.treeView.buildJsonSchema();
        let treeContent = viewComponents.treeView.getItems();
        await functionParam({
            "id": builtJsonSchema["$id"],
            "jsonSchema": builtJsonSchema,
            "treeContent": treeContent
        })
    };

    /**
     * Fornece ao botão 'Selecionar Versão' uma função para buscar as versões
     * @throws Lança um erro caso a função de busca não for fornecida no window.
     */
    headerComponents.setPopUpVersoesGetContent((() => {
        let windowFunction = window.popUpVersoesGetContent;
        if (!windowFunction) {
            throw new Error("[Erro] - [main] - Função 'popUpVersoesGetContent' não definido. modelo 'async (page, take) =>{ }'")
        }
        return windowFunction;
    })());

    /**
     * Fornece ao popUp de versões uma função para ser executada quando uma versão é clicada.
     * @throws Lança um erro caso a função não seja disponibilizada no window.
     * @throws Lança um erro caso o resultado da consulta não for o esperado.
     */
    headerComponents.setOnPopUpVersionClick(async (id) => {
        let windowFunction = window.popUpGetJsonContent;
        if (!windowFunction) {
            throw new Error("[Erro] - [main] - Função 'popUpGetJsonContent' não definido. modelo 'async (id) =>{ }'")
        }
        let result = await windowFunction(id);

        if (
            (typeof result != "object") ||
            (!result.id || !["string", "number"].includes(typeof result.id)) ||
            (!result.treeContent || !Array.isArray(result.treeContent) || result.treeContent.length == 0)
        ) {
            throw new Error([
                "[Erro] - [main] - valor inválido fornecido para 'popUpGetJsonContent'",
                "Valor esperado:",
                `{`,
                `  "id": "",`,
                `  "numeroVersao": "",`,
                `  "treeContent": []`,
                `}`
            ].join("\n"));
        }

        headerComponents.setHeaderinfo({
            "id": result.id,
            "numeroVersao": result.numeroVersao
        });
        viewComponents.treeView.setItems(result.treeContent);
        viewComponents.jsonViewer.setJson(viewComponents.treeView.buildJsonSchema());
        configComponents.clearConfigs();
        configComponents.enabledConfigs(false);
    });

    /**
     * Função de ação do clique em um node.
     * 
     * Função passa as informações do node para o painel de configurações.
     * @param {BaseNodeModel} param.itemData Informaçoes do node clicado.
     */
    viewComponents.treeView.onNodeClicked = ({ itemData }) => {
        configComponents.setNodeObject(Object.assign(new BaseNodeValueModel(), itemData.node_value), itemData.id, itemData.id_ref);
    };

    /**
     * Função de clique do botão Confirmar do painel de configuração.
     * @param {object} param
     * @param {object} param.event Evento de clique do botão.
     * @param {string} param.nodeId id do node.
     * @param {BaseNodeValueModel} param.nodeObject Valore do node.
     */
    configComponents.onConfirmClick = ({ event, nodeId, nodeObject }) => {
        viewComponents.treeView.updateItem({ nodeId, nodeObject });
    }

    /**
     * Função executada quando a aba é alterada.
     * @param {BaseTabModel} dataSource 
     * @returns {void}
     */
    viewComponents.onTabChanged = (dataSource) => {
        if (dataSource.id == "jsonRendererContainer") {
            configComponents.hideShowConfigs(false);
            configComponents.clearConfigs();
            configComponents.enabledConfigs(false);
            viewComponents.jsonViewer.setJson(viewComponents.treeView.buildJsonSchema());
            return;
        }

        if (dataSource.id == "treeView") {
            configComponents.hideShowConfigs(true);
            return;
        }
    }

    /** 
    * Define a linguagem local para o devExtreme.
    */
    DevExpress.localization.locale(navigator.language);
};

$(() => {
    main();
});
