export class APIFileModel {
    key?: string;
    name?: string;
    dateCreated?: Date;
    isDirectory: boolean = false;
    size: number = 0;
    hasSubDirectories: boolean = false;

}
