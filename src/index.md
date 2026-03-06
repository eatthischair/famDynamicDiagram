# A year of chess rankings

```js
import { Chart } from './components/Chart.js';
import { makeLinks } from './components/constants.js';
import { renderLinksForm } from './components/pure.js';
import { Generators } from 'observablehq:stdlib';
```

```js
let links = Mutable(makeLinks());

const groupCounts = {
  inner: 0,
  middle: 0,
  outer: 0,
};

links.value.forEach((l) => {
  const g = l.source.group;
  if (groupedLinks[g]) groupedLinks[g].push(l);
});

function countGroups(links) {}
function linksIntoString(links) {
  return renderLinksForm(links).map((link, i) => {
    const y = renderToggleButton(link, 'quality', i);
    const x = renderToggleButton(link, 'boundary', i);
    const z = renderToggleButton(link, 'reconsider', i);

    return html`
      <div>
        Relation between
        <span>${link.source}</span>
        and
        <span>${link.target}</span>
        is ${y} the boundary is ${x} and the communication is ${z}
      </div>
    `;
  });
}
function renderToggleButton(link, prop, index) {
  const value = link[prop];
  return html`
    <button
      style="color:${value === 'good' ? 'green' : 'red'}"
      onclick=${() => updateLinkProperty(prop, link, index)}
    >
      ${value}
    </button>
  `;
}
function updateLinkProperty(prop, link, i) {
  links.value = links.value.map((link, j) => {
    if (i === j) {
      return { ...link, [prop]: link[prop] ? false : true };
    } else {
      return { ...link };
    }
  });
}
```

  <details>
    <summary>
      Family Input
    </summary>
  <div class="card">

```js
const fam = view(
  Inputs.form({
    inner: Inputs.text({ label: 'Couple', placeholder: 'Name of parents', submit: true }),
    middle: Inputs.text({ label: 'Kids', placeholder: 'Name of children', submit: true }),
    outer: Inputs.text({
      label: 'Peripheral',
      placeholder: 'Name of peripheral family',
      submit: true,
    }),
  })
);
```

  </div>
  </details>

<details>
  <summary>
  Relations
  </summary>
  <!-- <div>
    ${linksIntoString(links).map(item => html`<span>${item}</span>`)}
  </div> -->
  <details>
  <summary>Inner Relations</summary>
  <div>
    ${linksIntoString(innerLinks).map(item => html`<span>${item}</span>`)}
  </div>
</details>

<details>
  <summary>Middle Relations</summary>
  <div>
    ${linksIntoString(middleLinks).map(item => html`<span>${item}</span>`)}
  </div>
</details>

<details>
  <summary>Outer Relations</summary>
  <div>
    ${linksIntoString(outerLinks).map(item => html`<span>${item}</span>`)}
  </div>
</details>
</details>

  <details>
    <summary>
      Bad Color Options
    </summary>
    <div class="card">

```js
const rgbaBad = view(
  Inputs.form({
    r: Inputs.range([0, 255], { step: 1, label: 'r', value: 200 }),
    g: Inputs.range([0, 255], { step: 1, label: 'g', value: 1 }),
    b: Inputs.range([0, 255], { step: 1, label: 'b', value: 1 }),
    a: Inputs.range([0, 1], { step: 0.01, label: 'a', value: 0.8 }),
  })
);
```

  </div>
  </details>
<!-- </div> -->
  <details>
    <summary>
      Good Color Options
    </summary>

  <div class="card">

```js
const rgbaGood = view(
  Inputs.form({
    r: Inputs.range([0, 255], { step: 1, label: 'r', value: 0 }),
    g: Inputs.range([0, 255], { step: 1, label: 'g', value: 200 }),
    b: Inputs.range([0, 255], { step: 1, label: 'b', value: 0 }),
    a: Inputs.range([0, 1], { step: 0.01, label: 'a', value: 0.3 }),
  })
);
```

  </div>
  </details>

<div class="card grid-row-span-2 grid-cols-span-2">

${Chart("none", invalidation, rgbaBad, rgbaGood, fam, links)}

<button>Save Data </button>

</div>
