import { TShapeType } from "Types/TShapeType";
import { SenderModel } from "../../models/SenderModel";
import { TDataSource } from "../../Types/TDataSource";
import { TInstanceUI } from "../../Types/TInstanceUI";
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
                break;
            case "sender":
                this.instanceUI = new SenderOptionsUI(data as SenderModel);
                break;
            case "startException":
                break;
            case "startProcess":
                break;
            default:
                throw new Error("[ERRO] - tipo não definido.")
        }
    }

    public mountOptions = (data: TDataSource) => {
        this.instanceUI?.distroyUI();
        this.setInstanceUI(data);
    }

    public onConfirm: ((data: TDataSource) => void) | undefined;
    private _onConfirm = (data: TDataSource) => {
        if (this.onConfirm) { this.onConfirm(data) }
    }


    constructor() { }
}