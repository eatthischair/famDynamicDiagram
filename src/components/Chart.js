import * as Plot from 'npm:@observablehq/plot'
import * as d3 from 'npm:d3'
import _ from 'npm:lodash'
import {
  height,
  width,
  radius,
  details,
  sortPeople,
  drag,
  hardCodedArcs,
} from '/components/constants.js'

export function Chart(invalidation, links, nodes, details) {
  console.log('CHARTJS args', arguments)
  if (links === null) links = {}
  if (nodes === null) nodes = {}

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'radial',
      d3.forceRadial((d, i) => sortPeople(d), 0, -(height / 2) * 0.6) //??
    )
    .force(
      'charge',
      d3
        .forceCollide()
        .radius(radius + 20)
        .iterations(10)
    )
    .alphaDecay(0.02)

  // Create the container SVG.
  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  //ARCs
  svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .selectAll('path')
    .data(hardCodedArcs)
    .join('path')
    .attr('d', (d, i) => hardCodedArcs[i])

  // Append lines
  const link = svg
    .append('g')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke-width', (d) => (d.reconsider ? 2.5 : 8))
    .attr('stroke-dasharray', (d) => (d.boundary ? '5,5' : 'none'))

  // Append nodes.
  const node = svg
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation))

  //Circle
  node
    .append('circle')
    .attr('fill', (d) => (d.group === 'inner' ? '#eaedd4' : '#bbbbbb'))
    .attr('r', (d) => (d.group === 'inner' ? 80 : radius))
    .attr('cx', (i) => 200 * i + 1)
    .attr('fill', (d) =>
      details.covenant && d.group === 'inner' ? '#e6d6a8' : '#ddd4bd'
    )
    .attr('stroke-width', (d) => (details.god && d.group === 'inner' ? 10 : 0))
    .attr('stroke', (d) =>
      details.god && d.group === 'inner' ? '#3baa51' : '#ffdba5'
    )

  const innerPerson = node
    .filter((d) => d.group === 'inner')
    .append('g')
    .selectAll('.innerPerson')
    .data((d) =>
      d.name
        .trim()
        .split('&')
        .map((n) => n.trim())
    )
    .enter()
    .append('g')
    .attr(
      'transform',
      (_, i) => `translate(${i === 0 ? -(80 - radius) : 80 - radius},0)`
    )
  innerPerson
    .append('circle')
    .attr('r', radius)
    .attr('fill', (_, i) => (i === 0 ? '#989898' : '#c1bdbd'))
  innerPerson
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '12px')
    .text((d) => d)

  //Text
  node
    .append('text')
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d) => (d.group !== 'inner' ? d.name : ''))

  //Event Listeners
  simulation.on('tick', () => {
    link.attr('d', (d) => {
      return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
    })
    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
  })

  invalidation.then(() => simulation.stop())

  return Object.assign(svg.node(), {
    updateGoodColors(goodColor, badColor) {
      link.attr('stroke', (d) => (d.quality ? goodColor : badColor))

      node
        .filter((d) => d.group === 'inner')
        .append('path')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', `M${-(80 - radius - 30)},0 L${80 - radius - 30},0`)
        .attr('stroke', (d) => (links[0].quality ? goodColor : badColor))
        .attr('stroke-width', (d) => (links[0].reconsider ? 2.5 : 8))
        .attr('stroke-dasharray', (d) => (links[0].boundary ? '3,3' : 'none'))
    },
  })
}
