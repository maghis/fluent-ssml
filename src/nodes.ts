import { Ssml, Literal, Attributes, Rendered, Params } from "./ssml";
import { Container } from "./container";

function toAttributes(obj: any): Attributes {
    const entries = Object.entries(obj).filter(([, v]) => v !== undefined);
    const ret: { [k: string]: any } = {};
    for (const [k, v] of entries)
        ret[k] = v;

    return Object.freeze(ret);
}

export abstract class SsmlNode implements Ssml {
    public abstract readonly name: string;
    public readonly attributes?: Readonly<Attributes>;
    public constructor(public readonly inner?: Container) {}

    render(params?: Params): Rendered {
        const ret: Rendered = {
            name: this.name,
            attributes: this.attributes || {}
        };

        if (this.inner) ret.content = this.inner.renderInner(params);

        return ret;
    }
}

export abstract class SsmlTextNode extends SsmlNode {
    public constructor(public readonly text?: string) {
        super(
            new Container(
                text !== undefined && text.length > 0
                    ? new Literal(text)
                    : undefined
            )
        );
    }
}

export class Effect extends SsmlNode {
    public readonly name = "amazon:effect";
    public readonly attributes = Object.freeze({ name: "whispered" });
    public constructor(
        public readonly effectName: "whispered",
        inner: Container
    ) {
        super(inner);
    }
}

export class Audio extends SsmlNode {
    public readonly name = "audio";
    public readonly attributes: Readonly<Attributes>;
    public constructor(public readonly src: string) {
        super();
        this.attributes = { src };
    }
}

export type BreakStrength =
    | "none"
    | "x-weak"
    | "weak"
    | "medium"
    | "strong"
    | "x-strong";

export interface BreakOptions {
    readonly strength?: BreakStrength;
    readonly time?: number;
}

export class Break extends SsmlNode {
    public readonly name = "break";
    public get attributes(): Readonly<Attributes> {
        return toAttributes({
            strength: this.options.strength,
            time:
                this.options.time !== undefined
                    ? `${Math.round(this.options.time)}ms`
                    : undefined
        });
    }
    public readonly options: BreakOptions;
    public constructor(options?: BreakOptions) {
        super();
        this.options = Object.assign({}, options);
    }
}

export type EmphasisLevel = "strong" | "moderate" | "reduced";
export class Emphasis extends SsmlNode {
    public readonly name = "emphasis";
    public readonly attributes: Readonly<Attributes>;
    public constructor(public readonly level: EmphasisLevel, inner: Container) {
        super(inner);
        this.attributes = Object.freeze({ level: this.level });
    }
}

export class P extends SsmlNode {
    public readonly name = "p";
    public constructor(inner: Container) {
        super(inner);
    }
}

export type PhonemeAlphabet = "ipa" | "x-sampa";

export class Phoneme extends SsmlTextNode {
    public readonly name = "phoneme";
    public readonly attributes: Readonly<Attributes>;
    public constructor(
        public readonly alphabet: PhonemeAlphabet,
        public readonly ph: string,
        public readonly text?: string
    ) {
        super(text);
        this.attributes = Object.freeze({
            alphabet: this.alphabet,
            ph: this.ph
        });
    }
}

export interface ProsodyOptions {
    readonly rate?: "x-slow" | "slow" | "medium" | "fast" | "x-fast";
    readonly pitch?: "x-low" | "low" | "medium" | "high" | "x-high" | string;
    readonly volume?:
        | "silent"
        | "x-soft"
        | "soft"
        | "medium"
        | "loud"
        | "x-loud";
}

export class Prosody extends SsmlNode {
    public readonly name = "prosody";
    public readonly attributes: Readonly<Attributes>;
    public constructor(
        public readonly options: ProsodyOptions,
        inner: Container
    ) {
        super(inner);
        this.attributes = toAttributes(options);
    }
}

export class S extends SsmlNode {
    public readonly name = "s";
    public constructor(inner: Container) {
        super(inner);
    }
}

export interface SayAsDate {
    readonly as: "date";
    readonly format:
        | "mdy"
        | "dmy"
        | "ymd"
        | "md"
        | "dm"
        | "ym"
        | "my"
        | "d"
        | "m"
        | "y";
}

export type SayAsInterpret =
    | "characters"
    | "cardinal"
    | "ordinal"
    | "digits"
    | "fraction"
    | "unit"
    | "date"
    | "time"
    | "telephone"
    | "address"
    | "interjection"
    | "expletive"
    | SayAsDate;

export class SayAs extends SsmlNode {
    public readonly name = "say-as";
    public get attributes(): Readonly<Attributes> {
        return typeof this.interpretAs === "string"
            ? { "interpret-as": this.interpretAs }
            : {
                  "interpret-as": this.interpretAs.as,
                  format: this.interpretAs.format
              };
    }
    public constructor(
        public readonly interpretAs: SayAsInterpret,
        inner: Container
    ) {
        super(inner);
    }
}

export class Sub extends SsmlTextNode {
    public readonly name = "sub";
    public get attributes(): Attributes {
        return { alias: this.alias };
    }
    public constructor(public readonly alias: string, text?: string) {
        super(text);
    }
}

export type WRole = "vb" | "vbd" | "nn" | "sense_1";

export class W extends SsmlNode {
    public readonly name = "w";
    public readonly attributes: Readonly<Attributes>;
    public constructor(public readonly role: WRole, inner: Container) {
        super(inner);
        this.attributes = Object.freeze({ role: this.role });
    }
}
