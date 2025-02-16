import { TComponentName } from "../../Types/TComponentName";
import { TDxInstanceType } from "../../Types/DxInstanceType";
import { DxDefaultValues } from "./DxDefaultValues";



export class InstanceProps {

    private instance: any;
    private componentValueField: string | undefined | ((instance: any) => string)
    private defaultValue: any;
    private tagName: string;

    constructor(args: { componentName: TComponentName, instance: TDxInstanceType, tagName: string }) {
        let xDefaultValues = new DxDefaultValues();
        this.instance = args.instance;
        this.defaultValue = xDefaultValues.getDefaultValue(args.componentName);
        this.componentValueField = xDefaultValues.getValueField(args.componentName) ?? "";
        this.tagName = args.tagName;
    }

    getInstance = (): TDxInstanceType => {
        return this.instance;
    }

    getInstanceValue = (): any => {
        if (this.componentValueField == undefined) { return }
        if (typeof this.componentValueField == "function") {
            return this.componentValueField(this.instance)
        }
        return this.instance.option(this.componentValueField);
    }

    setInstanceValue = (value: any): void => {
        this.instance.option(this.componentValueField, value);
    }

    clearInstanceValue = (): void => {
        this.instance.option(this.componentValueField, this.defaultValue);
    }

    disableEnableInstance = (valueParam?: boolean): void => {
        if (valueParam != undefined) {
            this.instance.option("disabled", valueParam);
        }
        let value: boolean = this.instance.option("disabled");
        this.instance.option("disabled", !value);
    }

    disableInstance = (): void => {
        this.instance.option("disabled", true);
    }

    enableInstance = (): void => {
        this.instance.option("disabled", false);
    }

    setVisibleInstance = (): void => {
        this.instance.option("visible", true);
    }

    setInvisibleInstance = (): void => {
        this.instance.option("visible", false);
    }

    setVisibleInvisibleInstance = (valueParam?: boolean): void => {
        if (valueParam != undefined) {
            this.instance.option("visible", valueParam);
        }
        let value: boolean = this.instance.option("visible");
        this.instance.option("visible", !value);
    }

    getTagName = (): string => {
        return this.tagName;
    }

}