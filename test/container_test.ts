import { Container, Literal, Rendered } from "../src/index";
import { test } from "ava";

test("append returns a new contained", t => {
    const cont = new Container();

    t.false(cont.append(new Literal("foo")) === cont);
});

test("paragraph with string", t => {
    const cont = new Container()
        .p("bar");

    const rendered = cont.renderInner()[0] as Rendered;
    if (!rendered.content)
        throw new Error();

    t.is(rendered.content[0], "bar");
});
