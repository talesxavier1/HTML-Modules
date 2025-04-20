import { TDataSource } from "Types/TDataSource";

export namespace DiagramModules {

    export class ShapeHierarchyModel {
        source?: TDataSource = undefined;
        children: Array<ShapeHierarchyModel> = [];
    }

    export interface IShapeHierarchy {
        source: TDataSource,
        children: Array<ShapeHierarchyModel>
    }
}