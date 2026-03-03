# A year of chess rankings

```js
import { Chart } from './components/Chart.js';
import { RenderLinksForm } from './RenderLinksForm.js';
import { makeLinks } from './components/constants.js';
import { Generators } from 'observablehq:stdlib';
```

<!-- ```js
let links = makeLinks(allPeople);
``` -->

```js
function debounce(input, delay = 1000) {
  return Generators.observe((notify) => {
    let timer = null;
    let value;

    // On input, check if we recently reported a value.
    // If we did, do nothing and wait for a delay;
    // otherwise, report the current value and set a timeout.
    function inputted() {
      if (timer !== null) return;
      notify((value = input.value));
      timer = setTimeout(delayed, delay);
    }

    // After a delay, check if the last-reported value is the current value.
    // If it’s not, report the new value.
    function delayed() {
      timer = null;
      if (value === input.value) return;
      notify((value = input.value));
    }

    (input.addEventListener('input', inputted), inputted());
    return () => input.removeEventListener('input', inputted);
  });
}
```

```js
let links = Mutable(makeLinks());

let originalData = makeLinks();

function linksIntoString(links) {
  return RenderLinksForm(links).map((link, i) => {
    const y = html` <button style="color:${link.quality === 'good' ? 'green' : 'red'}" onclick=${() => changeQuality('quality', links[i], i)}>${link.quality}</button> `;

    const x = html` <button style="color:${link.boundary === 'good' ? 'green' : 'red'}" onclick=${() => changeQuality('boundary', link, i)}>${link.boundary}</button> `;

    const z = html` <button style="color:${link.reconsider === 'good' ? 'green' : 'red'}" onclick=${() => changeQuality('reconsider', link, i)}>${link.reconsider}</button> `;

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

function changeQuality(prop, link, i) {
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

<div class="grid grid-cols-3 grid-rows-2">
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
