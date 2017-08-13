export interface Attributes {
    [name: string]: string | undefined;
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

export interface Ssml {
    render(params?: Params): Rendered | string;
}

export class Literal implements Ssml {
    public constructor(
        public readonly text: ((p: Params) => string) | string
    ) {}
    render(params: Params = {}) {
        return typeof this.text === "function"
            ? this.text(params)
            : this.text;
    }
}
