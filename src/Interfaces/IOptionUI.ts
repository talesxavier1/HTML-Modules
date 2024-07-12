import { TDataSource } from "../Types/TDataSource";

export interface IOptionUI {
    getData: () => TDataSource;
    distroyUI: () => void;
    repaint: () => void;
}