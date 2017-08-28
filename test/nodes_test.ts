import { test } from "ava";
import { Emphasis } from "../src/nodes";
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
