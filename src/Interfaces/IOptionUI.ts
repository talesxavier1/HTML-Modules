import { SenderOptionsUI } from "../UI/Options/SenderOptions/SenderOptionsUI";
import { TDataSource } from "../Types/TDataSource";

export interface IOptionUI {
    optionsHTMLContainer: string;
    hideShowHTMLContainer: (action: "SHOW" | "HIDE") => void
    getData: () => Promise<TDataSource>;
    distroyUI: () => Promise<void>;
    repaint: () => void;
}