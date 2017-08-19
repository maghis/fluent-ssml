import { Rendered } from "./ssml";
import * as xmlbuilder from "xmlbuilder";

type Ahead<T> = [T, T | undefined];

function* lookAhead<T>(iterable: Iterable<T>): IterableIterator<Ahead<T>> {
    const iterator = iterable[Symbol.iterator]();

    let aheadResult = iterator.next();
    // empty
    if (aheadResult.done) return;

    do {
        const current = aheadResult.value;
        aheadResult = iterator.next();
        yield [current, !aheadResult.done ? aheadResult.value : undefined];
    } while (!aheadResult.done);
}

export function toXml(node: Rendered, current?: any) {
    current = !current
        ? xmlbuilder.create(node.name)
        : (current = current.element(node.name, node.attributes));

    if (!node.content) return current;

    for (const [element, ahead] of lookAhead(node.content)) {
        current =
            typeof element === "string"
                ? current.text(element)
                : toXml(element, current).up();

        if (ahead) current = current.text(" ");
    }

    return current;
}
