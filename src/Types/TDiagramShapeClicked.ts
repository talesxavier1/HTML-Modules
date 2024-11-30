import { TDataSource } from "./TDataSource"

export type TDiagramShapeClicked = {
    event: DevExpress.ui.dxDiagram.ItemClickEvent,
    shapeData: TDataSource
}