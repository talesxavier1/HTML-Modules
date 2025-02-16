export namespace StorageModule {

    export class StorageItemData {
        key: string = "";
        name: string = "";
        dateCreated: Date | null = null;
        isDirectory: boolean = false;
        size: number = 0;
        hasSubDirectories: boolean = false;
    }

    export interface IStorageItemData {
        key: string;
        name: string;
        dateCreated: Date;
        isDirectory: boolean;
        size: number;
        hasSubDirectories: boolean;
    }

    export class StorageItem {
        dataItem: StorageItemData | null = null
        name: string = "";
        pathInfo: Array<StorageItemPathInfo> = []
        parentPath: string = "";
        relativeName: string = "";
        key: string = "";
        path: string = "";
        pathKeys?: Array<string> = []
        isDirectory: boolean = false
        size: number = 0
        dateModified: Date | null = null
        thumbnail: string = "";
        tooltipText: string = "";
    }

    export interface IStorageItem {
        dataItem: IStorageItemData;
        name: string;
        pathInfo: Array<IStorageItemPathInfo>;
        parentPath: string;
        relativeName: string;
        key: string;
        path: string;
        pathKeys: Array<string>;
        isDirectory: boolean;
        size: number;
        dateModified: Date;
        thumbnail: string;
        tooltipText: string;
    }

    export interface IStorageItemPathInfo {
        key: string
        name: string
    }

    export class StorageItemPathInfo {
        key: string = "";
        name: string = "";
    }
}