import { BaseAPIPayload, BaseAPIPayloadContext, BaseNodeModel, BaseNodeValueModel, BaseTabModel } from "./BaseModels.js";
import { GUID } from "./guid.js";
import { ConfigComponents, HeaderComponents, ViewComponents } from "./JSComponents.js";


const main = async () => {

    /**
     * ID da assinatura.
     * @type {String}
     * @throws Lança erro caso o valor para ID da assinatura não for passado no window.
     */
    const JSON_SCHEMA_ASSID = window.JSON_SCHEMA_ASSID;
    if (!JSON_SCHEMA_ASSID) {
        throw new Error("[Erro] - [main] - valor JSON_SCHEMA_ASSID não passado no window.");
    }

    /**
     * URL do gerenciador de arquivos.
     * @type {String}
     * @throws Lança erro caso o valor para URL do gerenciador de arquivos não for passado no window.
     */
    const FILE_MANAGEMENT_BASE_API = window.FILE_MANAGEMENT_BASE_API;
    if (!FILE_MANAGEMENT_BASE_API) {
        throw new Error("[Erro] - [main] - valor FILE_MANAGEMENT_BASE_API não passado no window.");
    }

    /**
     * ID do schema atual.
     * @type {String}
     * @throws Lança erro caso o valor não seja passado no window.
     */
    const SCHEMA_ID = window.SCHEMA_ID;
    if (!SCHEMA_ID) {
        throw new Error("[Erro] - [main] - valor SCHEMA_ID não passado no window.");
    }

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
     * Função que monta e faz a request de save do conteúdo.
     * @param {BaseAPIPayload} baseAPIPayload Payload.
     * @returns {Promise<boolean>} Retorna true caso obtenha sucesso.
     */
    const _callSaveContent = async (baseAPIPayload) => {
        let url = new URL(`${FILE_MANAGEMENT_BASE_API}/file-manager/`);

        let argumentsPost = {
            isDirectory: false,
            name: `JSON_SCHEMA-${baseAPIPayload.BaseAPIPayloadContext.ID}.json`,
            sourceIsDirectory: false,
            pathInfo: [],
            chunkMetadata: JSON.stringify({
                FileName: `JSON_SCHEMA-${baseAPIPayload.BaseAPIPayloadContext.ID}.json`,
                Index: 0,
                FileSize: 0,
                TotalCount: 1,
                UploadId: GUID.getGUID()
            })
        };

        let boundary = `----${GUID.getGUID().split("-").join("")}`;
        let finalContent = JSON.parse(JSON.stringify(baseAPIPayload));
        const body = [
            `--${boundary}`,
            `Content-Disposition: form-data; name="chunk"; filename="JSON_SCHEMA-${baseAPIPayload.BaseAPIPayloadContext.ID}.json"`,
            `Content-Type: application/octet-stream`,
            "",
            JSON.stringify(finalContent),
            `--${boundary}--`,
            ""
        ].join("\r\n");

        let response = await fetch(url, {
            headers: {
                "assID": baseAPIPayload.BaseAPIPayloadContext.assID,
                "processID": baseAPIPayload.BaseAPIPayloadContext.ID,
                "processVersionID": baseAPIPayload.BaseAPIPayloadContext.versionID,
                "packageID": baseAPIPayload.BaseAPIPayloadContext.ID,
                "packageVersionID": baseAPIPayload.BaseAPIPayloadContext.versionID,
                "tempDirID": baseAPIPayload.BaseAPIPayloadContext.tempID,
                "arguments": JSON.stringify(argumentsPost),
                "command": "SaveUniqueFileContent",
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
            },
            body: body,
            method: "POST"
        });

        return response.ok
    }

    /**
     * Função que monta e realiza a publicação do conteúdo salvo.
     * @param {BaseAPIPayloadContext} context 
     * @returns {Promise<String>} retorna o id da nova versão do json schema.
     * @throws Lança erro caso a api não retorne o id no campo strResult
     */
    const _callPubContent = async (context) => {
        let url = `${FILE_MANAGEMENT_BASE_API}/file-manager/?command={0}&arguments={1}`;
        url = url.replace("{0}", "PubTempDir");
        url = url.replace("{1}", "{}");

        let response = await fetch(encodeURI(url), {
            headers: {
                "processID": context.ID,
                "processVersionID": context.versionID,
                "packageID": context.ID,
                "packageVersionID": context.versionID,
                "tempDirID": context.tempID,
                "assID": context.assID
            },
            method: "POST"
        });
        if (response.ok) {
            let json = await response.json();
            if (!json.strResult) {
                throw new Error("Sem resposta.")
            }

            let objNewPackageVersionID = JSON.parse(json.strResult);
            if (!objNewPackageVersionID) {
                throw new Error("Sem resposta.")
            }
            return objNewPackageVersionID.newPackageVersionID;
        } else {
            throw new Error("Sem resposta.")
        }
    }

    /**
     * Ação executada quando o botão 'Salvar em nova versão' é clicado.
     * 
     * Função executa envia como parâmetro o treeview, id do schema e o schema montado.
     * 
     * Função busca no window uma função fornecida pela aplicação com o nome de 'onBtnSaveClick'. Caso não encontrada, nada acontece e um aviso é lançado.
     * @returns {void}
     */
    headerComponents.btnSaveNewVersionClicked = async () => {
        let builtJsonSchema = viewComponents.treeView.buildJsonSchema();
        let treeContent = viewComponents.treeView.getItems();

        let baseAPIPayloadContext = new BaseAPIPayloadContext(SCHEMA_ID, JSON_SCHEMA_ASSID);
        let baseAPIPayload = new BaseAPIPayload(baseAPIPayloadContext, builtJsonSchema, treeContent);

        await _callSaveContent(baseAPIPayload);
        let newVersionID = await _callPubContent(baseAPIPayloadContext);
        headerComponents.setHeaderinfo({
            "id": SCHEMA_ID,
            "numeroVersao": newVersionID
        })
    };

    /**
     * Busca as versões dos schemas;
     * @returns {Promise<Array<BaseAPIGetDirContent>>}
     */
    const _getDirContent = async () => {
        return new Promise((resolve) => {
            let url = `${FILE_MANAGEMENT_BASE_API}/file-manager/?command={0}&arguments={1}`;
            url = url.replace("{0}", "GetDirContents");
            url = url.replace("{1}", JSON.stringify({ "pathInfo": [], "name": "" }));
            fetch(encodeURI(url), {
                headers: {
                    "processID": SCHEMA_ID,
                    "processVersionID": SCHEMA_ID,
                    "packageID": SCHEMA_ID,
                    //"packageVersionID": "",
                    "tempDirID": "",
                    "scriptModule": "UNIQUE_SCRIPT",
                    "assID": JSON_SCHEMA_ASSID
                },
                method: "GET"
            }).then((response) => {
                if (!response.ok) {
                    resolve(null);
                }
                return response.json();
            }).then((body) => {
                resolve(body);
            });
        })
    }

    /**
     * Função para dividir um aray em subarrays.
     * @param {Array<any>} arr 
     * @param {number} size 
     * @returns 
     */
    const _splitArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    /**
     * Fornece ao botão 'Selecionar Versão' uma função para buscar as versões
     * @throws Lança um erro caso a função de busca não for fornecida no window.
     */
    headerComponents.setPopUpVersoesGetContent(
        async (page, take) => {
            let content = await _getDirContent();
            content.result = content.result.sort((a, b) => {
                let timeDateA = new Date(a.dateCreated).getTime();
                let timeDateB = new Date(b.dateCreated).getTime();

                if (timeDateA < timeDateB) { return 1 }
                return -1;
            });
            // content.result = content.result.sort((a, b) => (a.UrlJsonContext.final_tprlin < b.UrlJsonContext.final_tprlin) ? 1 : ((b.UrlJsonContext.final_tprlin < a.UrlJsonContext.final_tprlin) ? -1 : 0))

            let splitResult = _splitArray(content.result, take);

            return {
                count: content.result.length,
                data: splitResult[page - 1].map(VALUE => {
                    return {
                        "id": SCHEMA_ID,
                        "numeroVersao": VALUE.key,
                        "dataCriacao": VALUE.dateCreated,
                    }
                })
            }
        }
    );

    /**
     * Monta a request e busca o conteúdo da versão passada do schema.
     * @param {string} version id da versão.
     * @returns {BaseAPIPayload}
     */
    const _getFileContent = async (version) => {

        let pathInfo = [{
            key: version,
            name: ""
        }];
        let url = `${FILE_MANAGEMENT_BASE_API}/file-manager/?command={0}&arguments={1}`;
        url = url.replace("{0}", "GetFileContent");
        url = url.replace("{1}", JSON.stringify({ "pathInfo": pathInfo, "name": name }));

        let result = await fetch(encodeURI(url), {
            headers: {
                "processID": SCHEMA_ID,
                "processVersionID": SCHEMA_ID,
                "packageID": SCHEMA_ID,
                "packageVersionID": "",
                "tempDirID": "",
                "assID": JSON_SCHEMA_ASSID
            },
            method: "GET"
        });
        if (!result.ok) {
            return "";
        }
        let json = await result.json();
        return json.strResult ? JSON.parse(json.strResult) : null;
    }

    /**
     * Fornece ao popUp de versões uma função para ser executada quando uma versão é clicada.
     * @throws Lança um erro caso a função não seja disponibilizada no window.
     * @throws Lança um erro caso o resultado da consulta não for o esperado.
     */
    headerComponents.setOnPopUpVersionClick(async (version) => {
        // let windowFunction = window.popUpGetJsonContent;
        // if (!windowFunction) {
        //     throw new Error("[Erro] - [main] - Função 'popUpGetJsonContent' não definido. modelo 'async (id) =>{ }'")
        // }
        let result = await _getFileContent(version);

        if (
            (typeof result != "object") ||
            // (!result.id || !["string", "number"].includes(typeof result.id)) ||
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
            "id": SCHEMA_ID,
            "numeroVersao": version
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
