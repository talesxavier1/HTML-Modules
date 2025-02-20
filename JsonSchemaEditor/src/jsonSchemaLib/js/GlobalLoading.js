
export class GlobalLoading {
    static show(componentIDPosition) {
        let loadIndicatorInstance = window.loadIndicatorInstance;
        if (!loadIndicatorInstance) {
            let instance = $('#globalLoadIndicator').dxLoadPanel({
                // indicatorSrc: './images/loading.svg',
                shadingColor: 'rgba(0,0,0,0.4)',
                width: 100,
                height: 100,
                position: { of: "#js_content" },
                visible: true,
                showIndicator: true,
                showPane: true,
                shading: true,
                hideOnOutsideClick: false,
                onShown(e) {
                    if (!e.component["_$wrapper"]) { return }
                    let wrapper = $(e.component["_$wrapper"]);
                    $(wrapper).css("z-index", wrapper.css("z-index") + 2);
                },
            }).dxLoadPanel('instance');

            window.loadIndicatorInstance = instance;
        }
    }

    static hide() {
        let loadIndicatorInstance = window.loadIndicatorInstance;
        if (loadIndicatorInstance) {
            loadIndicatorInstance.dispose();
        }
        window.loadIndicatorInstance = null;
    }
}