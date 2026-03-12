import { html } from 'npm:htl'

export function renderLinksForm(links) {
  return links.map((link) => {
    return shapeData(link)
  })
}

export function shapeData(link) {
  return {
    source: link.source.name,
    target: link.target.name,
    boundary: link.boundary,
    reconsider: link.reconsider,
    quality: link.quality,
  }
}

export function formatData(fam) {
  console.log('fam input', fam)
  for (const group in fam) {
    fam[group] = fam[group].split(',')
    fam[group] = fam[group].map((p) => p.trim())

    let parentsAlreadyFormatted = fam.inner[0].includes('&')
    if (group === 'inner' && !parentsAlreadyFormatted) {
      fam[group] = [`${fam[group][0]} & ${fam[group][1]}`]
    }
  }
  return fam
}
export function renderButtonText(prop) {
  return prop ? 'good' : 'bad'
}

export function flatten(people) {
  console.log('flatten', people)
  if (!people) return
  return Object.entries(people).flatMap(([group, person]) =>
    person.map((name) => ({ name: name, group: group }))
  )
}

export function makeLinks(people) {
  let data = []
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      if (Math.random() > 0) {
        data.push({
          source: people[i],
          target: people[j],
          reconsider: j > people.length / 2 ? false : true,
          quality: j > people.length / 2 ? true : false,
          boundary: j < people.length / 2 ? true : false,
        })
      }
    }
  }

  let parents
  for (var node of people) {
    if (node.group === 'inner') {
      parents = node.name.split('&')
    }
  }

  data.unshift({
    source: { name: parents[0], group: 'inner' }, // name of first inner circle
    target: { name: parents[1], group: 'inner' }, // name of second inner circle
    reconsider: false,
    quality: true,
    boundary: false,
  })
  return data
}
