import { APIFileModel } from "./APIFileModel";

export class APIResponseContentModel {
    success: boolean = true;
    errorText?: string;
    result?: APIFileModel[];
    strResult?: string;
}

