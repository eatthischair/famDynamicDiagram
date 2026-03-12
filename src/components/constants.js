import * as d3 from 'npm:d3'

export const mult = 0.5
export const height = Math.round(window.screen.height * mult)
export const width = Math.round(window.screen.width * mult)

export const hardCodedArcs = [
  `M -100,${-(height / 2) * mult}  A 20,20 0,0,0 100,${-(height / 2) * mult}`,
  `M -300,${-(height / 2) * mult}  A 20,20 0,0,0 300,${-(height / 2) * mult}`,
  `M -500,${-(height / 2) * mult}   A 20,20 0,0,0 500,${-(height / 2) * mult}`,
]

export const radius = 30.5
export const radii = [0, 200, 375]
export const details = {
  covenant: true,
  god: true,
}

export function sortPeople(person) {
  if (person.group === 'inner') {
    return radii[0]
  }
  if (person.group === 'middle') {
    return radii[1]
  }
  if (person.group === 'outer') {
    return radii[2]
  }
}

export function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}
