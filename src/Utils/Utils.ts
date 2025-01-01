
import CryptoJS from 'crypto-js';

export class Utils {

    static getNewSVGComponent = (type: keyof SVGElementTagNameMap): JQuery<SVGElementTagNameMap[keyof SVGElementTagNameMap]> => {
        const schemaSVG: string = "http://www.w3.org/2000/svg";
        return $(document.createElementNS('http://www.w3.org/2000/svg', type));
    }


    static getGuid = (): string => {
        var d = new Date().getTime();
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // static debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    //     let timeoutId: ReturnType<typeof setTimeout> | undefined;
    //     return function (this: any, ...args: any[]) {
    //         if (timeoutId) {
    //             clearTimeout(timeoutId);
    //         }
    //         timeoutId = setTimeout(() => {
    //             func.apply(this, args);
    //         }, delay);
    //     };
    // }

    static debounce(func: (...args: any[]) => Promise<any> | void, delay: number): (...args: any[]) => Promise<void> {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        return async function (this: any, ...args: any[]) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            return new Promise<void>((resolve) => {
                timeoutId = setTimeout(async () => {
                    try {
                        await func.apply(this, args);
                    } catch (error) {
                        console.error("Error in debounced function:", error);
                    } finally {
                        resolve();
                    }
                }, delay);
            });
        };
    }

    static generateHashFromBlob(blob: Blob) {
        if (!blob) { return ""; }

        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        const readerPromise = new Promise<ArrayBuffer>((resolve, reject) => {
            reader.onloadend = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onerror = reject;
        });
        const arrayBuffer = readerPromise as unknown as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
    }

    static tryparse = (value: string): Object | undefined => {
        try {
            return JSON.parse(value);
        } catch (err) {
            return undefined;
        }
    }

    static sha256 = async (message: string) => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    }

    static delay(sec: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, sec * 1000); // 2000 ms = 2 segundos
        });
    }
}