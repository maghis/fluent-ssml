import { Container } from "./container";
import { Ssml, Rendered, Content } from "./ssml";
import * as xmlbuilder from "xmlbuilder";

export function ssml(inner?: Ssml | string) {
    const ret = new Container();
    if (inner)
        return typeof inner === "string" ? ret.say(inner) : ret.append(inner);

    return ret;
}

export function toXml(node: Rendered, current?: any) {
    current = !current
        ? xmlbuilder.create(node.name)
        : (current = current.element(node.name, node.attributes));

    if (!node.content) return current;

    for (const element of node.content) {
        current =
            typeof element === "string"
                ? (current = current.text(element + " "))
                : (current = toXml(element, current).up());
    }

    return current;
}

function isRendered(ssml: Container | Rendered): ssml is Rendered {
    return (ssml as any).name === "speak";
}

export function renderXml(ssml: Container): string;
export function renderXml(rendered: Rendered): string;
export function renderXml(ssml: Container | Rendered): string {
    if (!isRendered(ssml)) ssml = ssml.render();

    return toXml(ssml).toString();
}

export * from "./ssml";
export * from "./container";
export * from "./nodes";
