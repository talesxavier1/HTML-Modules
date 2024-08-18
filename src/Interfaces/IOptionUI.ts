import { SenderOptionsUI } from "../UI/Options/SenderOptions/SenderOptionsUI";
import { TDataSource } from "../Types/TDataSource";

export interface IOptionUI {
    optionsHTMLContainer: string;
    hideShowHTMLContainer: (action: "SHOW" | "HIDE") => void
    getData: () => TDataSource;
    distroyUI: () => void;
    repaint: () => void;
}