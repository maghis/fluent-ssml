import { test } from "ava";
import { Emphasis, SayAs, Break } from "../src/nodes";
import { ssml } from "../src/index";

test("beak attributes", t => {
    const node = new Break({ time: 100, strength: "strong" });
    t.deepEqual(node.attributes, { time: "100ms", strength: "strong" });
});

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
