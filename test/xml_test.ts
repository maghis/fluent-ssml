import { test } from "ava";
import { renderXml } from "../src/index";
import { Rendered } from "../src/ssml";
import rewire = require("rewire");

const rewired = rewire("../src/xml");
const lookAhead: (
    iterabla: Iterable<any>
) => IterableIterator<any> = rewired.__get__("lookAhead");

function root(): Rendered {
    return {
        name: "speak",
        attributes: {},
        content: []
    };
}

function element(name: string): Rendered {
    return {
        name: name,
        attributes: {},
        content: undefined
    };
}

test("empty", t => {
    t.is(renderXml(root()), "<speak/>");

    const rendered = root();
    rendered.content = [];
    t.is(renderXml(rendered), "<speak/>");
});

test("empty with attribute", t => {
    const rendered = root();
    const ele = element("foo");
    rendered.content = [ele];

    ele.attributes = { bar: "baz" };

    t.is(renderXml(rendered), '<speak><foo bar="baz"/></speak>');
});

test("text with attribute", t => {
    const rendered = root();
    const ele = element("foo");
    rendered.content = [ele];

    ele.attributes = { bar: "baz" };
    ele.content = ["bap"];

    t.is(renderXml(rendered), '<speak><foo bar="baz">bap</foo></speak>');
});

test("simple text", t => {
    const rendered = root();
    rendered.content = ["foo"];

    t.is(renderXml(rendered), "<speak>foo</speak>");
});

test("space between consecutive text", t => {
    const rendered = root();
    rendered.content = ["foo", "bar"];
    const xml = renderXml(rendered);

    t.is(xml, "<speak>foo bar</speak>");
});

test("space before element", t => {
    const rendered = root();
    rendered.content = ["foo", element("bar")];
    const xml = renderXml(rendered);

    t.is(xml, "<speak>foo <bar/></speak>");
});

test("space after element", t => {
    const rendered = root();
    rendered.content = [element("foo"), "bar"];
    const xml = renderXml(rendered);

    t.is(xml, "<speak><foo/> bar</speak>");
});

test("space between consecutive elements", t => {
    const rendered = root();
    rendered.content = [element("foo"), element("bar")];
    const xml = renderXml(rendered);

    t.is(xml, "<speak><foo/> <bar/></speak>");
});

test("lookBehindAhead empty", t => {
    t.deepEqual([...lookAhead([])], []);
});

test("lookBehindAhead single", t => {
    t.deepEqual([...lookAhead([1])], [[1, undefined]]);
});

test("lookBehindAhead many", t => {
    t.deepEqual([...lookAhead([1, 2, 3])], [[1, 2], [2, 3], [3, undefined]]);
});
