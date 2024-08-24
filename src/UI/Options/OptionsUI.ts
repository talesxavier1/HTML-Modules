import { ComponentInstanceModel } from "../../Utils/dx-utils/ComponentInstanceModel";
import { TDataSource } from "../../Types/TDataSource";
import { TInstanceUI } from "../../Types/TInstanceUI";
import { MulticastInOptionsUI } from "./MulticastInOptions/MulticastInOptionsUI";
import { ScriptOptionsUI } from "./ScriptOptions/ScriptOptionsUI";
import { SenderOptionsUI } from "./SenderOptions/SenderOptionsUI";
import { InstanceProps } from "../../Utils/dx-utils/InstanceProps";
import { MulticastOutOptions } from "./MulticastOutModelOptions/MulticastOutOptions";
import { NodeStore } from "../../Data/NodeStore";


export class OptionsUI {
    private componentInstanceModel = new ComponentInstanceModel<Object>(new Object);
    private instanceUI?: TInstanceUI;
    private nodeStore: NodeStore;

    private setInstanceUI = (data: TDataSource) => {
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
                this.instanceUI = new MulticastInOptionsUI(data, false, "multicastIn_options");
                break;
            case "multicastOut":
                this.instanceUI = new MulticastOutOptions(data, false, "multicastOut_options", this.nodeStore);
                break;
            case "processContainer":
                break;
            case "reciver":
                break;
            case "script":
                this.instanceUI = new ScriptOptionsUI(data, false, "script_options");
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

    public distroyOptionsUI = () => {
        this.instanceUI?.distroyUI();
        this.componentInstanceModel.disposeAllInstances();
    }

    public btnConfirmDeclineCliked = (action?: "CONFIRM" | "DECLINE", data?: TDataSource) => { }
    private _btnConfirmDeclineCliked = (action: "CONFIRM" | "DECLINE") => {
        this.btnConfirmDeclineCliked(action, this.getData());
        this.distroyOptionsUI();
    }

    private mountButtonsConfirmDecline = () => {
        this.componentInstanceModel.addInstance(new InstanceProps({
            componentName: "dxButton",
            tagName: "splitter_options_confirm_btn",
            instance: $("#splitter_options_confirm_btn").dxButton({
                icon: "check",
                type: "success",
                onClick: () => this._btnConfirmDeclineCliked("CONFIRM")
            }).dxButton("instance")
        }));

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

    public mountOptions = (data: TDataSource) => {
        this.distroyOptionsUI();
        this.setInstanceUI(data);
        this.mountButtonsConfirmDecline();
    }

    public getData = (): TDataSource | undefined => {
        return this.instanceUI?.getData() ?? undefined;
    }

    constructor(nodeStore: NodeStore) {
        this.nodeStore = nodeStore;
    }
}