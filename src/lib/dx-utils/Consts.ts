
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
    { componentName: "dxList", defaultValue: [], valueField: "items" },
    { componentName: "dxTreeView", defaultValue: [], valueField: "items" },
    { componentName: "dxTabs", defaultValue: 0, valueField: "selectedItem" },
    { componentName: "dxPopup", defaultValue: false, valueField: "visible" },
    { componentName: "dxLoadIndicator", defaultValue: true, valueField: "visible" },
];

export { ListdxComponentValue, DxComponentValue }