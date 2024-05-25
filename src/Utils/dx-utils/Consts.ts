
interface IdxComponentValue {
    componentName: string,
    defaultValue: any,
    valueField: string | undefined
}

class DxComponentValue implements IdxComponentValue {
    componentName: string = "";
    defaultValue: any;
    valueField: string | undefined = "";
}

const ListdxComponentValue: Array<DxComponentValue> = [
    { componentName: "dxTextBox", defaultValue: "", valueField: "value" },
    { componentName: "dxSelectBox", defaultValue: null, valueField: "value" },
    { componentName: "dxCheckBox", defaultValue: false, valueField: "value" },
    { componentName: "dxNumberBox", defaultValue: 0, valueField: "value" },
    { componentName: "dxButton", defaultValue: undefined, valueField: undefined },
    { componentName: "dxContextMenu", defaultValue: undefined, valueField: undefined },
    { componentName: "dxDiagram", defaultValue: undefined, valueField: undefined },
    { componentName: "dxList", defaultValue: [], valueField: "items" },
    { componentName: "dxTreeView", defaultValue: [], valueField: "items" },
    { componentName: "dxTabs", defaultValue: 0, valueField: "selectedItem" },
    { componentName: "dxPopup", defaultValue: false, valueField: "visible" },
    { componentName: "dxLoadIndicator", defaultValue: true, valueField: "visible" },
];

//#region

type TConstruInstanceProps = {
    componentName: string,
    instance: any,
    tagName: string
}

type DxInstanceType =
    DevExpress.ui.dxAccordion |
    DevExpress.ui.dxActionSheet |
    DevExpress.ui.dxAutocomplete |
    DevExpress.viz.dxBarGauge |
    DevExpress.ui.dxBox |
    DevExpress.viz.dxBullet |
    DevExpress.ui.dxButton |
    DevExpress.ui.dxButtonGroup |
    DevExpress.ui.dxCalendar |
    DevExpress.viz.dxChart |
    DevExpress.ui.dxCheckBox |
    DevExpress.viz.dxCircularGauge |
    DevExpress.ui.dxColorBox |
    DevExpress.ui.dxContextMenu |
    DevExpress.ui.dxDataGrid |
    DevExpress.ui.dxDateBox |
    DevExpress.ui.dxDateRangeBox |
    DevExpress.ui.dxDeferRendering |
    DevExpress.ui.dxDiagram |
    DevExpress.ui.dxDraggable |
    DevExpress.ui.dxDrawer |
    DevExpress.ui.dxDropDownBox |
    DevExpress.ui.dxDropDownButton |
    DevExpress.ui.dxFileManager |
    DevExpress.ui.dxFileUploader |
    DevExpress.ui.dxFilterBuilder |
    DevExpress.ui.dxForm |
    DevExpress.viz.dxFunnel |
    DevExpress.ui.dxGallery |
    DevExpress.ui.dxGantt |
    DevExpress.ui.dxHtmlEditor |
    DevExpress.viz.dxLinearGauge |
    DevExpress.ui.dxList |
    DevExpress.ui.dxLoadIndicator |
    DevExpress.ui.dxLoadPanel |
    DevExpress.ui.dxLookup |
    DevExpress.ui.dxMap |
    DevExpress.ui.dxMenu |
    DevExpress.ui.dxMultiView |
    DevExpress.ui.dxNumberBox |
    DevExpress.viz.dxPieChart |
    DevExpress.ui.dxPivotGrid |
    DevExpress.ui.dxPivotGridFieldChooser |
    DevExpress.viz.dxPolarChart |
    DevExpress.ui.dxPopover |
    DevExpress.ui.dxPopup |
    DevExpress.ui.dxProgressBar |
    DevExpress.ui.dxRadioGroup |
    DevExpress.viz.dxRangeSelector |
    DevExpress.ui.dxRangeSlider |
    DevExpress.ui.dxRecurrenceEditor |
    DevExpress.ui.dxResizable |
    DevExpress.ui.dxResponsiveBox |
    DevExpress.viz.dxSankey |
    DevExpress.ui.dxScheduler |
    DevExpress.ui.dxScrollView |
    DevExpress.ui.dxSelectBox |
    DevExpress.ui.dxSlider |
    DevExpress.ui.dxSortable |
    DevExpress.viz.dxSparkline |
    DevExpress.ui.dxSpeedDialAction |
    DevExpress.ui.dxSwitch |
    DevExpress.ui.dxTabPanel |
    DevExpress.ui.dxTabs |
    DevExpress.ui.dxTagBox |
    DevExpress.ui.dxTextArea |
    DevExpress.ui.dxTextBox |
    DevExpress.ui.dxTileView |
    DevExpress.ui.dxToast |
    DevExpress.ui.dxToolbar |
    DevExpress.ui.dxTooltip |
    DevExpress.ui.dxTreeList |
    DevExpress.viz.dxTreeMap |
    DevExpress.ui.dxTreeView |
    DevExpress.ui.dxValidationGroup |
    DevExpress.ui.dxValidationMessage |
    DevExpress.ui.dxValidationSummary |
    DevExpress.ui.dxValidator |
    DevExpress.viz.dxVectorMap
//#endregion

export { ListdxComponentValue, DxComponentValue, DxInstanceType }