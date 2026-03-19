import { html } from 'npm:htl'

export function renderLinksForm(links) {
  return links.map((link) => {
    return shapeData(link)
  })
}

// export const emptyObj = {
//   inner: '',
//   middle: '',
//   outer: '',
// }

export function shapeData(link) {
  return {
    source: link.source.name,
    target: link.target.name,
    boundary: link.boundary,
    reconsider: link.reconsider,
    quality: link.quality,
  }
}

// export function formatData(fam) {
//   //for now this is fine. as long as shitty data isnt somehow saved to storage
//   return fam
// }

export function formatInner(str) {
  let alreadyFormatted = str.includes('&')
  if (!alreadyFormatted) {
    str = str.trim()
    str = str.split(',')
    str = `${str[0].trim()} & ${str[1].trim()}`
  }
  return [str] //always return array bc always string coming from input
}

export function formatDataFromTextInput(fam) {
  let res = {}
  //from text input obj to an array of string
  for (const group in fam) {
    let cur: string = fam[group]

    if (group === 'inner') {
      res.inner = formatInner(cur)
    } else if (cur.includes(',')) {
      //i.e. there are multiple elements in the string
      res[group] = cur.split(',').map((p) => p.trim())
    } else {
      //else bc what if only one item
      res[group] = [cur]
    }
  }
  return res
  //circuitous way to turn delimited strings in a array. there must be something better i s2g
}

export function renderButtonText(prop) {
  return prop ? 'good' : 'bad'
}

export function flatten(people) {
  //takes input obj and turns it into nodes. an array of objects like so [{name:johmmy group: inner}, {name: binge, group: outer}]
  //in memory: stored as an array of strings, but must be visible in text boxes as strings with comma
  if (people === null) {
    return null
  }

  let aids = Object.entries(people).flatMap(([group, person]) => {
    let isEmpty = person[0] === '' // person = [''];
    if (!isEmpty) {
      return person.map((name) => ({ name: name, group: group }))
    }
  })

  let res = []
  for (let i = 0; i < aids.length; i++) {
    if (aids[i]) {
      res.push(aids[i])
    }
  }
  //awful but it works
  return res
}

export function linkFromSave(sourceName, targetName, savedLinkData) {
  if (!savedLinkData) return

  for (let i = 0; i < savedLinkData.length; i++) {
    let cur = savedLinkData[i]
    let curSourceName = cur.source.name
    let curTargetName = cur.target.name
    if (sourceName === curSourceName && targetName === curTargetName) {
      //found right object
      return cur
    }
  }
}

export function initializeLinks(people, savedLinkData) {
  if (people === null) {
    return null
  }

  let data = []
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      let savedLink = linkFromSave(
        people[i].name,
        people[j].name,
        savedLinkData
      )

      data.push({
        source: people[i],
        target: people[j],
        reconsider: savedLink?.reconsider || false,
        quality: savedLink?.quality || false,
        boundary: savedLink?.boundary || false,
      })
    }
  }

  let parents
  for (var node of people) {
    if (node.group === 'inner') {
      parents = node.name.split('&').map((p) => p.trim())
    }
  }

  let s = null
  if (savedLinkData) s = savedLinkData[0]
  //inner node is always the first one in the list
  data.unshift({
    source: { name: parents[0], group: 'inner' }, // name of first inner circle
    target: { name: parents[1], group: 'inner' }, // name of second inner circle
    reconsider: s?.reconsider || false,
    quality: s?.quality || false,
    boundary: s?.boundary || false,
  })
  return data
}
