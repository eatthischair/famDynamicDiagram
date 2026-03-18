# Family Dynamic Diagram

```js
import { Chart } from './components/Chart.js'
import {
  formatData,
  renderButtonText,
  makeLinks,
  flatten,
  formatDataFromTextInput,
} from './components/pure.js'
import { Generators } from 'observablehq:stdlib'
```

```js
let people = Mutable(flatten(famNames))
let links = Mutable(makeLinks(people?.value))
function updatePeopleAndLinks(ppl) {
  people.value = ppl
  links.value = makeLinks(ppl)
}

function linksIntoString(links) {
  return links.map((link, i) => {
    const y = renderToggleButton(link, 'quality')
    const x = renderToggleButton(link, 'boundary')
    const z = renderToggleButton(link, 'reconsider')
    return html`
      <div>
        Relation between
        <span>${link.source.name}</span>
        and
        <span>${link.target.name}</span>
        is ${y} the boundary is ${x} and the communication is ${z}
      </div>
    `
  })
}

function renderToggleButton(link, prop) {
  const value = link[prop]
  return html`
    <button
      style="color:${value ? 'green' : 'red'}"
      onclick=${(e) => toggleLinkProperty(prop, link, e)}
    >
      ${renderButtonText(value)}
    </button>
  `
}

function toggleLinkProperty(prop, link, e) {
  console.log('eee', e)
  e.preventDefault()
  links.value = links.value.map((l) => {
    if (_.isEqual(l, link)) {
      return { ...l, [prop]: !l[prop] }
    } else {
      return { ...l }
    }
  })
}
```

  <details>
    <summary>
      Family Input
    </summary>
  <div class="card">

```js
const famNames = JSON.parse(localStorage.getItem('fam'))
```

```js
const fam = view(
  Inputs.form({
    inner: Inputs.text({
      label: 'Couple',
      placeholder: 'Name of parents',
      value: famNames?.inner || '',
    }),
    middle: Inputs.text({
      label: 'Kids',
      placeholder: 'Name of children',
      value: famNames?.middle || '',
    }),
    outer: Inputs.text({
      label: 'Peripheral',
      placeholder: 'Name of peripheral family',
      value: famNames?.outer || '',
    }),
  })
)
```

```js
function onClick() {
  let formatted = formatDataFromTextInput(fam)
  let oldData = formatData(JSON.parse(window.localStorage.getItem('fam')))

  //probably need to make sure data is formatted somehow idk
  if (!_.isEqual(formatted, formatData(JSON.parse(window.localStorage.getItem('fam')))))
    console.log('penis haha', people, 'newdata', flatten(formatted))
  updatePeopleAndLinks(flatten(formatted))
  localStorage.setItem('fam', JSON.stringify(formatted))
}

function Save() {
  return html`
    <div>
      <button onclick=${onClick}>Save</button>
    </div>
  `
}

function clear() {
  window.localStorage.clear()
}

function ClearStorage() {
  return html`
    <div>
      <button onclick=${clear}>Clear</button>
    </div>
  `
}
```

  <div>
    ${Save()}

  </div>

  <div>
   ${ClearStorage()}

   </div>

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
  Outer Relations
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
const goodColors = view(Inputs.color({ label: 'Good Colors', value: '#7ec39a' }))
```

```js
const badColors = view(Inputs.color({ label: 'Bad Colors', value: '#a01c1c' }))
```

  </div>
  </details>
</details>

<div class="card grid-row-span-2 grid-cols-span-2">

```js
{
  displayChart.updateGoodColors(goodColors, badColors)
}
```

```js
const displayChart = Chart(invalidation, links, people)
display(displayChart)
```

</div>
