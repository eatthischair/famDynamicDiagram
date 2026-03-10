# Family Dynamic Diagram

```js
import { Chart } from './components/Chart.js';
import { makeLinks } from './components/constants.js';
import { renderLinksForm, shapeData, renderButtonText } from './components/pure.js';
import { Generators } from 'observablehq:stdlib';
```

```js
let links = Mutable(makeLinks());

function linksIntoString(links) {
  return links.map((link, i) => {
    const y = renderToggleButton(link, 'quality');
    const x = renderToggleButton(link, 'boundary');
    const z = renderToggleButton(link, 'reconsider');
    return html`
      <div>
        Relation between
        <span>${link.source.name}</span>
        and
        <span>${link.target.name}</span>
        is ${y} the boundary is ${x} and the communication is ${z}
      </div>
    `;
  });
}

function renderToggleButton(link, prop) {
  const value = link[prop];
  return html`
    <button
      style="color:${value ? 'green' : 'red'}"
      onclick=${() => toggleLinkProperty(prop, link)}
    >
      ${renderButtonText(value)}
    </button>
  `;
}

function toggleLinkProperty(prop, link) {
  links.value = links.value.map((l) => {
    if (_.isEqual(l, link)) {
      return { ...l, [prop]: !l[prop] };
    } else {
      return { ...l };
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

  <details>
  <summary>
  Inner Relations
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'inner')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>

  <details>
  <summary>
  Middle Relations
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'middle')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>

  <details>
  <summary>
  Inner Relations
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'outer')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>
</details>

<details>
  <summary>
  Color Options
  </summary>

  <div class="card">

```js
const goodColors = view(Inputs.color({ label: 'Good Colors', value: '#7ec39a' }));
```

```js
const badColors = view(Inputs.color({ label: 'Bad Colors', value: '#a01c1c' }));
```

  </div>
  </details>
</details>

<div class="card grid-row-span-2 grid-cols-span-2">

```js
displayChart.updateGoodColors(goodColors, badColors);
```

```js
const displayChart = Chart('none', invalidation, null, null, fam, links);
display(displayChart);
```

<button>Save Data </button>

</div>
