import { Container } from "./container";
import { Ssml, Rendered, Content, Params, Template } from "./ssml";
import { toXml } from "./xml";

export function ssml(inner?: Ssml | Template | string) {
    const ret = new Container();
    if (inner)
        return typeof inner === "string" || typeof inner === "function"
            ? ret.say(inner)
            : ret.append(inner);

    return ret;
}

function isRendered(ssml: Container | Rendered): ssml is Rendered {
    return (ssml as any).name === "speak";
}

export function renderXml(ssml: Container, params?: Params): string;
export function renderXml(rendered: Rendered): string;
export function renderXml(ssml: Container | Rendered, params?: Params): string {
    if (!isRendered(ssml)) ssml = ssml.render(params);

    return toXml(ssml).toString();
}

export * from "./ssml";
export * from "./container";
export * from "./nodes";
