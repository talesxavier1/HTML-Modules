import { ComponentInstanceModel } from "../../Utils/dx-utils/ComponentInstanceModel";
import { TDataSource } from "../../Types/TDataSource";
import { TInstanceUI } from "../../Types/TInstanceUI";
import { MulticastInOptionsUI } from "./MulticastInOptions/MulticastInOptionsUI";
import { ScriptOptionsUI } from "./ScriptOptions/ScriptOptionsUI";
import { SenderOptionsUI } from "./SenderOptions/SenderOptionsUI";
import { InstanceProps } from "../../Utils/dx-utils/InstanceProps";
import { MulticastOutOptions } from "./MulticastOutModelOptions/MulticastOutOptions";
import { NodeStore } from "../../Data/NodeStore";
import { ProcessContext } from "../../models/ProcessContext";


export class OptionsUI {
    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);
    private instanceUI?: TInstanceUI;
    private nodeStore: NodeStore;
    private readonly: boolean;

    private setInstanceUI = async (data: TDataSource) => {

        switch (data.type) {
            case "condition":
                break;
            case "endException":
                break;
            case "endProcess":
                break;
            case "exceptionSubprocess":
                break;
            case "logger":
                break;
            case "multicastIn":
                this.instanceUI = new MulticastInOptionsUI(data, this.readonly, "multicastIn_options");
                break;
            case "multicastOut":
                this.instanceUI = new MulticastOutOptions(data, this.readonly, "multicastOut_options", this.nodeStore);
                break;
            case "processContainer":
                break;
            case "reciver":
                break;
            case "script":
                this.instanceUI = new ScriptOptionsUI(data, this.readonly, "script_options");
                await this.instanceUI.init();
                break;
            case "sender":
                this.instanceUI = new SenderOptionsUI(data, false, "multicastIn_options");
                break;
            case "startException":
                break;
            case "startProcess":
                break;
            default:
                console.warn("[ERRO] - tipo não definido.")
        }
    }

    public distroyOptionsUI = async () => {
        await this.instanceUI?.distroyUI();
        this.componentInstanceModel.disposeAllInstances();
    }

    public btnConfirmDeclineCliked = async (action?: "CONFIRM" | "DECLINE", data?: TDataSource) => { }
    private _btnConfirmDeclineCliked = async (action: "CONFIRM" | "DECLINE") => {
        if (action == "DECLINE") {
            this.btnConfirmDeclineCliked(action);
        } else {
            this.btnConfirmDeclineCliked(action, await this.getData());
        }

        this.distroyOptionsUI();
    }

    private mountButtonsConfirmDecline = () => {
        if (!this.readonly) {
            this.componentInstanceModel.addInstance(new InstanceProps({
                componentName: "dxButton",
                tagName: "splitter_options_confirm_btn",
                instance: $("#splitter_options_confirm_btn").dxButton({
                    icon: "check",
                    type: "success",
                    onClick: () => this._btnConfirmDeclineCliked("CONFIRM")
                }).dxButton("instance")
            }));
        }

        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxButton",
            tagName: "splitter_options_decline_btn",
            instance: $("#splitter_options_decline_btn").dxButton({
                icon: "remove",
                type: "danger",
                onClick: () => this._btnConfirmDeclineCliked("DECLINE")
            }).dxButton("instance")
        }));
    }

    public mountOptions = async (data: TDataSource) => {
        await this.distroyOptionsUI();
        await this.setInstanceUI(data);
        this.mountButtonsConfirmDecline();
    }

    public async getData(): Promise<TDataSource | undefined> {
        let result = await this.instanceUI?.getData();
        if (result) {
            return result
        }
    }


    constructor(nodeStore: NodeStore, readonly: boolean) {
        this.nodeStore = nodeStore;
        this.readonly = readonly;
    }
}