# fluent-ssml

Compose Alexa SSML (*Speech Synthesis Markup Language*) with a fluent interface.

Features:
- support for the full [Alexa SSML Reference](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference)
- everything is immutable, which makes it reusable and composable (like strings)
- simple templating
- extensible and testable

**NOTE:** this package is tested on node v8.4.0

## install it

```
npm install --save fluent-ssml
```

## use it

Most basic template

```ts
import { ssml, renderXml } from "fluent-ssml";

const template = ssml("I am a template");

// prints <speak>I am a template</speak>
console.log(renderXml(template));
```

Using templated strings for parametric templates

```ts
const template = ssml(p => `${p.name} is a cool dude`);

// prints <speak>Jon is a cool dude</speak>
console.log(renderXml(template, { name: "Jon" }));
```

Use the fluent api for more complicated templates

This code...
```ts
const template = ssml()
    .p(
        ssml()
            .sayAs("characters", "ssml")
            .say("templates can get quite complicated")
    )
    .p("it's important to keep them composable and parametric")
    .p(
        ssml()
            .say("if you do")
            .break({ strength: "strong" })
            .say(p => `you are gonna keep your ${p.quality}`)
    )
    .sayAs("interjection", "abracadabra");

// produces a simple object model with the rendered template
// easy to use for testing or debugging
const rendered = template.render({ quality: "sanity" });

// produces the final xml
const xml = renderXml(rendered);

console.log(xml);
```

...renders this (reformatted for clarity)
```xml
<speak>
    <p>
        <say-as interpret-as="characters">ssml</say-as> templates can get quite complicated
    </p>
    <p>
        it's important to keep them composable and parametric
    </p>
    <p>
        if you do <break strength="strong"/> you are gonna keep your sanity
    </p>
    <say-as interpret-as="interjection">abracadabra</say-as>
</speak>
```
