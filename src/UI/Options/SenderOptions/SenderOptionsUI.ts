import { ComponentInstanceModel } from "../../../Utils/dx-utils/ComponentInstanceModel";
import { IOptionUI } from "../../../Interfaces/IOptionUI";
import { SenderModel } from "../../../models/SenderModel";
import { TDataSource } from "../../../Types/TDataSource";

export class SenderOptionsUI implements IOptionUI {
    private componentInstanceModel = new ComponentInstanceModel<SenderModel>(new SenderModel());

    private data: TDataSource;
    setData = (data: TDataSource) => {

    };

    getData = () => {
        let builtObject = this.componentInstanceModel.getBuiltObject();
        return {
            ...this.data,
            ...builtObject
        } as SenderModel;
    };

    distroyUI = () => {

    };

    repaint = () => {

    };

    constructor(data: TDataSource) {
        this.data = data;

    }

}