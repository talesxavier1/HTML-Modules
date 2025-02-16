

type FunctionDefinition = Array<{ functionTag: string, functionAction: () => any }> | (() => any);
interface IFunctionProps {
    functionDefinition: FunctionDefinition;
    tagName: string;
}

export class FunctionProps implements IFunctionProps {
    private _functionDefinition: FunctionDefinition;
    private _tagName: string;

    constructor(args: IFunctionProps) {
        this._functionDefinition = args.functionDefinition;
        this._tagName = args.tagName;
    }

    get functionDefinition(): FunctionDefinition {
        return this._functionDefinition;
    }

    get tagName(): string {
        return this._tagName
    }
}