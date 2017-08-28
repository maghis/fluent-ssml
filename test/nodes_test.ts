import { test } from "ava";
import { Emphasis, SayAs } from "../src/nodes";
import { ssml } from "../src/index";

test("emphasis", t => {
    const node = new Emphasis("strong", ssml("foo"));

    const rendered = node.render();

    t.deepEqual(rendered, {
        name: "emphasis",
        attributes: { level: "strong" },
        content: ["foo"]
    });
});

test("sayAs", t => {
    const node = new SayAs("cardinal", ssml("1234"));

    const rendered = node.render();

    t.deepEqual(rendered, {
        name: "say-as",
        attributes: { "interpret-as": "cardinal" },
        content: ["1234"]
    });
});
