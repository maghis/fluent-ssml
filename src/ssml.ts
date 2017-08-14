export interface Attributes {
    [name: string]: string;
}

export type Content = (Rendered | string)[];

export interface Rendered {
    name: string;
    attributes: Attributes;
    content?: Content;
}

export interface Params {
    [name: string]: any;
}

export type Template = (p: Params) => string;

export interface Ssml {
    render(params?: Params): Rendered | string;
}

export class Literal implements Ssml {
    public constructor(
        public readonly text: Template | string
    ) {}
    render(params: Params = {}) {
        return typeof this.text === "function"
            ? this.text(params)
            : this.text;
    }
}
