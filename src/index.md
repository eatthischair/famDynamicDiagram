# A year of chess rankings

```js
import { Chart } from './components/Chart.js';
import { makeLinks } from './components/constants.js';
import { renderLinksForm } from './components/pure.js';
import { Generators } from 'observablehq:stdlib';
```

```js
let links = Mutable(makeLinks());
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
  return html` <button style="color:${value === 'good' ? 'green' : 'red'}" onclick=${() => updateLinkProperty(prop, link, index)}>${value}</button> `;
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

<div>
  <div>
    ${linksIntoString(links).map(item => html`<span>${item}</span>`)}
  </div>
</div>
html`

<details>
  <summary style="cursor:pointer; font-weight:600;">
    Advanced Settings
  </summary>

  <div style="margin-top: 0.5rem;">
    <label>
      Threshold:
      <input type="number" value="10">
    </label>
  </div>
</details>
<div class="grid grid-cols-3 grid-rows-2">

<details>
<summary style="cursor:pointer; font-weight:600;">
<div class="card" style=" font-weight: bold; max-height: 200px">

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
</summary>
</details>
<div class="card">

```js
const rgbaGood = view(
  Inputs.form({
    r: Inputs.range([0, 255], { step: 1, label: 'r', value: 0 }),
    g: Inputs.range([0, 255], { step: 1, label: 'g', value: 200 }),
    b: Inputs.range([0, 255], { step: 1, label: 'b', value: 0 }),
    a: Inputs.range([0, 1], { step: 0.01, label: 'a', value: 0.1 }),
  })
);
```

</div>

<div class="card">

```js
const fam = view(
  Inputs.form({
    inner: Inputs.text({ label: 'Couple', placeholder: 'Name of parents', submit: true }),
    middle: Inputs.text({ label: 'Kids', placeholder: 'Name of children', submit: true }),
    outer: Inputs.text({ label: 'Peripheral', placeholder: 'Name of peripheral family', submit: true }),
  })
);
```

</div>
</div>
<div class="card grid-row-span-2 grid-cols-span-2">

${Chart("none", invalidation, rgbaBad, rgbaGood, fam, links)}

</div>
