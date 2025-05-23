export class GlobalLoadIndicator {
    static show(origem?: string) {
        let localWindow: any = window;
        let loadIndicatorInstance = localWindow.loadIndicatorInstance;
        if (!loadIndicatorInstance) {
            let log = localStorage.getItem("LOG_GlobalLoadIndicator") ?? "false";
            if (origem && log == "true") {
                console.log("GlobalLoadIndicator - SHOW - origem:" + origem);
            }
            let instance = $('#globalLoadIndicator').dxLoadPanel({
                indicatorSrc: './images/loading.svg',
                shadingColor: 'rgba(0,0,0,0.4)',
                width: 100,
                height: 100,
                position: { of: "#splitter" },
                visible: true,
                showIndicator: true,
                showPane: true,
                shading: true,
                hideOnOutsideClick: false,
                onShown(e: any) {
                    if (!e.component["_$wrapper"]) { return }
                    let wrapper = $(e.component["_$wrapper"]);
                    $(wrapper).css("z-index", wrapper.css("z-index") + 2);
                },
            }).dxLoadPanel('instance');

            localWindow.loadIndicatorInstance = instance;
        }
    }

    static hide(origem?: string) {
        let localWindow: any = window;
        let loadIndicatorInstance = localWindow.loadIndicatorInstance;
        if (loadIndicatorInstance) {
            let log = localStorage.getItem("LOG_GlobalLoadIndicator") ?? "false";
            if (origem && log == "true") {
                console.log("GlobalLoadIndicator - HIDE - origem:" + origem);
            }
            (loadIndicatorInstance as DevExpress.ui.dxLoadPanel).dispose();
        }
        localWindow.loadIndicatorInstance = null;
    }
}