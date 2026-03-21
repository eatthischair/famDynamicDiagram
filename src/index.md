---
theme: [glacier]
style: custom-style.css
---

# Family Dynamic Diagram

```js
import { Chart } from './components/Chart.js'
import {
  formatData,
  renderButtonText,
  renderLinks,
  flatten,
  formatDataFromTextInput,
  shapeLinksForSave,
  clear,
  clearStorage,
  cap,
} from './components/pure.js'
import { Generators } from 'observablehq:stdlib'
import { html } from 'npm:htl'
```

```js
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = '/styles.css' // make sure path is correct
document.head.appendChild(link)
```

```js
//State
let savedLinkData = JSON.parse(localStorage.getItem('links'))
let people = Mutable(flatten(JSON.parse(localStorage.getItem('fam'))))
let links = Mutable(renderLinks(people.value, savedLinkData))

function savePeople() {
  let formatted = formatDataFromTextInput(fam)
  let nodes = flatten(formatted)
  let newLinks = renderLinks(nodes, savedLinkData)

  people.value = nodes
  links.value = newLinks

  localStorage.setItem('links', JSON.stringify(newLinks))
  localStorage.setItem('fam', JSON.stringify(formatted))
  localStorage.setItem('details', JSON.stringify(details))
}

function Save() {
  function handleSavePeople(e) {
    savePeople()
    const tooltip = e.currentTarget.parentElement.querySelector('.tooltip')
    tooltip.classList.add('visible')
    setTimeout(() => tooltip.classList.remove('visible'), 2000)
  }
  return html`
    <div class="save-wrapper">
      <button class="save" onclick=${handleSavePeople}>Save</button>
      <div class="tooltip">Saved!</div>
    </div>
  `
}

function linksIntoString(links) {
  return links.map((link, i) => {
    const y = renderToggleButton(link, 'quality')
    const x = renderToggleButton(link, 'boundary')
    const z = renderToggleButton(link, 'reconsider')
    return html`
      <div>
        The relationship between
        <span>${cap(link.source.name)}</span>
        and
        <span>${cap(link.target.name)}</span>
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
  let linksForSave = renderLinks(people.value, links.value)
  links.value = linksForSave
  localStorage.setItem('links', JSON.stringify(linksForSave))
}

function saveLinks() {
  function handleSave(e) {
    saveLinksToLocalStorage()
    const tooltip = e.currentTarget.parentElement.querySelector('.tooltip')
    tooltip.classList.add('visible')
    setTimeout(() => tooltip.classList.remove('visible'), 2000)
  }

  return html`
    <div class="save-wrapper">
      <button class="save" onclick=${handleSave}>Save</button>
      <div class="tooltip">Saved!</div>
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
      placeholder: 'Jane, John',
      value: famNames?.inner || '',
    }),
    middle: Inputs.text({
      label: 'Kids',
      placeholder: 'Michael, Janie etc.',
      value: famNames?.middle || '',
    }),
    outer: Inputs.text({
      label: 'Peripheral',
      placeholder: 'Rob, Nancy etc.',
      value: famNames?.outer || '',
    }),
  })
)

const detailsFromStorage = JSON.parse(localStorage.getItem('details'))
const details = view(
  Inputs.form({
    covenant: Inputs.toggle({ label: 'Covenant', value: detailsFromStorage?.covenant || false }),
    god: Inputs.toggle({ label: 'God', value: detailsFromStorage?.god || false }),
  })
)
```

When you are finished, click ${Save()}

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

When you are finished, click ${saveLinks()}

</div>

</details>

</details>

<div class="card grid-row-span-2 grid-cols-span-2 chart">

```js
{
  displayChart.updateGoodColors(goodColors, badColors)
}
```

```js
const displayChart = Chart(invalidation, links, people, details)
display(displayChart)
```

<details>
  <summary>
  Color Options
  </summary>

  <div class="card">

```js
const goodColors = view(Inputs.color({ label: 'Good Colors', value: '#6CC56A' }))
```

```js
const badColors = view(Inputs.color({ label: 'Bad Colors', value: '#DA2C38' }))
```

  </div>
  </details>
</div>
