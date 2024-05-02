import { Utils } from "../lib/dx-utils/Utils.js";
import { ShapeModel } from "./ShapeModel.js";
export class EntryModel extends ShapeModel {
    constructor(ID) {
        super("entry", ID);
        this.name = "";
        this.path = "";
        this.testeIDCont = Utils.getGuid();
    }
}
//# sourceMappingURL=EntryModel.js.map