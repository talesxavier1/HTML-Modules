import { TDataSource } from "../../Types/TDataSource";
import { TInstanceUI } from "../../Types/TInstanceUI";
import { ScriptOptionsUI } from "./ScriptOptions/ScriptOptionsUI";
import { SenderOptionsUI } from "./SenderOptions/SenderOptionsUI";


export class OptionsUI {
    private instanceUI: TInstanceUI | undefined;

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
                break;
            case "multicastOut":
                break;
            case "processContainer":
                break;
            case "reciver":
                break;
            case "script":
                this.instanceUI = new ScriptOptionsUI(data, false);
                break;
            case "sender":
                this.instanceUI = new SenderOptionsUI(data);
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
    }

    public mountOptions = (data: TDataSource) => {
        this.distroyOptionsUI()
        this.setInstanceUI(data);
    }

    public onConfirm: ((data: TDataSource) => void) | undefined;
    private _onConfirm = (data: TDataSource) => {
        if (this.onConfirm) { this.onConfirm(data) }
    }


    constructor() { }
}