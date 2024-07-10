import { TDataSource } from "../Types/TDataSource";

export interface IOptionUI {
    setData: (data: TDataSource) => void;
    getData: () => TDataSource;
    distroyUI: () => void;
    repaint: () => void;
}