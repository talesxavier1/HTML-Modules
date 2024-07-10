import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { SenderModel } from "../../../models/SenderModel";
import { TDataSource } from "../../../Types/TDataSource";

export class SenderOptionsUI implements IOptionUI {
    setData = (data: TDataSource) => {

    };

    getData = () => {
        return new SenderModel();
    };

    distroyUI = () => {

    };

    repaint = () => {

    };

    constructor(data?: TDataSource) {
        if (data) {
            this.setData(data);
        }
    }

}