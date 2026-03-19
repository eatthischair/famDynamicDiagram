# Family Dynamic Diagram

```js
import { Chart } from './components/Chart.js'
import {
  formatData,
  renderButtonText,
  initializeLinks,
  flatten,
  formatDataFromTextInput,
  shapeLinksForSave,
} from './components/pure.js'
import { Generators } from 'observablehq:stdlib'
```

```js
let savedLinkData = JSON.parse(localStorage.getItem('links'))

let people = Mutable(flatten(JSON.parse(localStorage.getItem('fam'))))
let links = Mutable(initializeLinks(people.value, savedLinkData))

function updatePeople(ppl) {
  people.value = ppl
  let newLinks = initializeLinks(ppl, savedLinkData)
  links.value = newLinks
  localStorage.setItem('links', JSON.stringify(newLinks))
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
  e.preventDefault()
  links.value = links.value.map((l) => {
    if (_.isEqual(l, link)) {
      return { ...l, [prop]: !l[prop] }
    } else {
      return { ...l }
    }
  })
}

function saveLinksToLocalStorage() {
  console.log('im being called, boss')
  let linksForSave = initializeLinks(people.value, links.value)
  links.value = linksForSave
  localStorage.setItem('links', JSON.stringify(linksForSave))
}

function saveLinks() {
  return html`
    <div>
      <button onclick=${saveLinksToLocalStorage}>Save</button>
    </div>
  `
}
```

 <details> <summary>1. Family Input </summary>
   <div class="card">

Input the names of your family members, **separated by commas**

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

const covenantAndGod = view(
  Inputs.form({
    covenant: Inputs.toggle({ label: 'Covenant', value: false }),
    god: Inputs.toggle({ label: 'God', value: false }),
  })
)
```

When you are finished, click **Save**

```js
function savePeople() {
  let formatted = formatDataFromTextInput(fam)
  updatePeople(flatten(formatted))
  localStorage.setItem('fam', JSON.stringify(formatted))
  localStorage.setItem('extraData', JSON.stringify(covenantAndGod))
}

function Save() {
  return html`
    <div>
      <button onclick=${savePeople}>Save</button>
    </div>
  `
}

function clear() {
  window.localStorage.clear()
}

function clearStorage() {
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
   ${clearStorage()}

   </div>

  </div>
  </details>

<details>
  <summary>
  2. Relations
  </summary>

  <details>
  <summary>
  Inner
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'inner')).map(item => html`<span>${item}</span>`)}

  </div>
  </details>

  <details>
  <summary>
  Middle
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'middle')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>

  <details>
  <summary>
  Outer
  </summary>
  <div>
   ${linksIntoString(links.filter(item => item.source.group === 'outer')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>
<div>
${saveLinks()}

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
const displayChart = Chart(invalidation, links, people, covenantAndGod)
display(displayChart)
```

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
</div>
