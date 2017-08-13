import * as nodes from "./nodes";
import { Ssml, Literal, Content, Rendered, Params } from "./ssml";

export type Inner = Container | string;

function toContainer(inner: Container | string): Container {
    return typeof inner === "string"
        ? new Container(new Literal(inner))
        : inner;
}

export class Container {
    public readonly content: ReadonlyArray<Ssml>;
    public constructor(content?: Ssml);
    public constructor(content: Ssml[]);
    public constructor(content: Ssml[] | Ssml | undefined = []) {
        this.content = Object.freeze(
            Array.isArray(content) ? content : [content]
        );
    }

    public renderInner(params?: Params): Content {
        return this.content.map(c => c.render(params));
    }

    public render(params?: Params): Rendered {
        return {
            name: "speak",
            attributes: {},
            content: this.renderInner(params)
        };
    }

    public append(item: Ssml): Container {
        return new Container(this.content.concat(item));
    }

    public say(text: string): Container {
        return this.append(new Literal(text));
    }

    public effect(name: "whispered", inner: Inner): Container {
        return this.append(new nodes.Effect(name, toContainer(inner)));
    }

    public audio(src: string) {
        return this.append(new nodes.Audio(src));
    }

    public break(options: nodes.BreakOptions) {
        return this.append(new nodes.Break(options));
    }

    public emphasis(level: nodes.EmphasisLevel, inner: Inner) {
        return this.append(new nodes.Emphasis(level, toContainer(inner)));
    }

    public p(inner: Inner) {
        return this.append(new nodes.P(toContainer(inner)));
    }

    public phoneme(alphabet: nodes.PhonemeAlphabet, ph: string, text?: string) {
        this.append(new nodes.Phoneme(alphabet, ph, text));
    }

    public prosody(options: nodes.ProsodyOptions, inner: Inner) {
        return this.append(new nodes.Prosody(options, toContainer(inner)));
    }

    public s(inner: Inner) {
        return this.append(new nodes.S(toContainer(inner)));
    }

    public sayAs(as: nodes.SayAsInterpret, inner: Inner) {
        return this.append(new nodes.SayAs(as, toContainer(inner)));
    }

    public sub(alias: string, text?: string) {
        return this.append(new nodes.Sub(alias, text));
    }

    public w(role: nodes.WRole, inner: Inner) {
        return this.append(new nodes.W(role, toContainer(inner)));
    }
}
