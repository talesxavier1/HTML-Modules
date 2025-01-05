import { StorageModule } from "./StorageModule";


export namespace APIModule {

    export namespace Request {
        export interface IArguments {
            pathInfo?: StorageModule.StorageItemPathInfo[];
            isDirectory: boolean;
            name: string;
            destinationPathInfo?: StorageModule.StorageItemPathInfo[];
            sourcePathInfo?: StorageModule.StorageItemPathInfo[];
            chunkMetadata?: string;
            sourceIsDirectory: boolean;
        }

        export interface IChunkMetadata {
            UploadId: string;
            FileName: string;
            Index: number;
            TotalCount: number;
            FileSize: number;
            partByte: Uint8Array;
        }
    }

    export namespace Response {
        export interface IContent {
            success: boolean
            errorText: string;
            result: StorageModule.StorageItemData[];
            strResult?: string;
        }
    }

}