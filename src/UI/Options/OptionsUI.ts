import { TDataSource } from "../../Types/TDataSource";
import { TInstanceUI } from "../../Types/TInstanceUI";
import { SenderOptionsUI } from "./SenderOptions/SenderOptionsUI";


export class OptionsUI {
    private instanceUI: TInstanceUI | undefined;

    public mountOptions = (data: TDataSource) => {
        this.instanceUI?.distroyUI();
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
                break;
            case "sender":
                this.instanceUI = new SenderOptionsUI(data);
                break;
            case "startException":
                break;
            case "startProcess":
                break;
            default:
                throw new Error("[ERRO] - tipo não definido.")
        }
    }

    public onConfirm: ((data: TDataSource) => void) | undefined;
    private _onConfirm = (data: TDataSource) => {
        if (this.onConfirm) { this.onConfirm(data) }
    }


    constructor() { }
}