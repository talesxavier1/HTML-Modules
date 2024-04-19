import { DxDefaultValues } from "./DxDefaultValues.js";
export class InstanceProps {
    constructor(args) {
        var _a;
        this.getInstance = () => {
            return this.instance;
        };
        this.getInstanceValue = () => {
            return this.instance.option(this.componentValueField);
        };
        this.setInstanceValue = (value) => {
            this.instance.option(this.componentValueField, value);
        };
        this.clearInstanceValue = () => {
            this.instance.option(this.componentValueField, this.defaultValue);
        };
        this.disableEnableInstance = (valueParam) => {
            if (valueParam != undefined) {
                this.instance.option("disabled", valueParam);
            }
            let value = this.instance.option("disabled");
            this.instance.option("disabled", !value);
        };
        this.disableInstance = () => {
            this.instance.option("disabled", true);
        };
        this.enableInstance = () => {
            this.instance.option("disabled", false);
        };
        this.setVisibleInstance = () => {
            this.instance.option("visible", true);
        };
        this.setInvisibleInstance = () => {
            this.instance.option("visible", false);
        };
        this.setVisibleInvisibleInstance = (valueParam) => {
            if (valueParam != undefined) {
                this.instance.option("visible", valueParam);
            }
            let value = this.instance.option("visible");
            this.instance.option("visible", !value);
        };
        this.getTagName = () => {
            return this.tagName;
        };
        let xDefaultValues = new DxDefaultValues();
        this.instance = args.instance;
        this.defaultValue = xDefaultValues.getDefaultValue(args.componentName);
        this.componentValueField = (_a = xDefaultValues.getValueField(args.componentName)) !== null && _a !== void 0 ? _a : "";
        this.tagName = args.tagName;
    }
}
//# sourceMappingURL=InstanceProps.js.map