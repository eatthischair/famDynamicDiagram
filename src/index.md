---
theme: [glacier]
style: custom-style.css
---

# Family Dynamic Diagram

#### An interactive graph of family relationships

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
    const z = renderToggleButton(link, 'reconsider', true)
    return html`
      <div class="line">
        The communication between
        <span>${cap(link.source.name)}</span>
        and
        <span>${cap(link.target.name)}</span>
        is ${z} ${y} and the boundary is ${x}
      </div>
    `
  })
}

function renderToggleButton(link, prop, edgeCase) {
  const value = link[prop]
  return html`
    <button
      class="toggle-button"
      style="color:${value ? 'green' : 'red'};"
      onclick=${(e) => toggleLinkProperty(prop, link, e)}
    >
      ${renderButtonText(value, edgeCase)}
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

<details >
  <summary><strong>How to use</strong></summary>
  <ol class="instructions">
    <li>Enter family members</li>
    <li>Define relationships</li>
    <li>View your diagram</li>
  </ol>
</details>

<div class="parent">
 <details> <summary>Step 1</summary>
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
    chaos: Inputs.text({
      label: 'Who in your family is causing the most chaos?',
      value: detailsFromStorage?.chaos || '',
    }),
    covenant: Inputs.toggle({
      label: 'Marriage covenant',
      value: detailsFromStorage?.covenant || false,
    }),
    god: Inputs.toggle({ label: 'God covenant', value: detailsFromStorage?.god || false }),
    alignment: Inputs.radio(['25%', '50%', '75%'], {
      value: detailsFromStorage?.alignment || null,
      unique: true,
      label: 'Degree of alignment:',
    }),
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
  Step 2
  </summary>
<strong>Define your families' relationships</strong>

  <details>
  <summary>
  Inner
  </summary>
  <div class="card">
   ${linksIntoString(links.filter(item => item.source.group === 'inner')).map(item => html`<span>${item}</span>`)}

  </div>
  </details>

  <details>
  <summary>
  Middle
  </summary>
  <div class="card">
   ${linksIntoString(links.filter(item => item.source.group === 'middle')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>

  <details>
  <summary>
  Outer
  </summary>
  <div class="card">
   ${linksIntoString(links.filter(item => item.source.group === 'outer')).map(item => html`<span>${item}</span>`)}
  </div>
  </details>
<div>

When you are finished, click ${saveLinks()}

</div>

</details>

</details>

```js
if (links && people) {
  document.body.classList.add('has-data')
} else {
  document.body.classList.remove('has-data')
}
```

<div class="empty-state">
  No data yet — add your family to begin
</div>

<div class="card grid-row-span-2 grid-cols-span-2 chart color-options">

```js
{
  displayChart.updateGoodColors(goodColors, badColors)
}
```

```js
const displayChart = Chart(invalidation, links, people, details)
if (links && people) display(displayChart)
```

<details class="color-options">
  <summary>
  Color Options
  </summary>

  <div>

```js
const goodColors = view(Inputs.color({ label: 'Good Colors', value: '#212421' }))
```

```js
const badColors = view(Inputs.color({ label: 'Bad Colors', value: '#e1848a' }))
```

  </div>
  </details>

</div>
</div>
