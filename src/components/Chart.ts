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
  colors,
} from '/components/constants.js'
import { html } from 'npm:htl'
// import { cap } from '/components/pure.ts'

export function Chart(invalidation, links, nodes, details) {
  if (links === null) links = {}
  if (nodes === null) nodes = {}

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'radial',
      d3
        .forceRadial((d, i) => sortPeople(d), 0, -(height / 2) * 0.6)
        .strength(0.05)
    )
    .force(
      'charge',
      d3
        .forceCollide()
        .strength(0.5) // default is 1
        .radius(radius + 10)
        .iterations(20)
    )
    .alphaDecay(0.002)

  // Create container SVG.
  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height - 400)
    .attr('viewBox', [
      -width / 3 + 100,
      -height / 3 - 100,
      width - 350,
      height - 350,
    ])

  //Filter
  const defs = svg.append('defs')
  defs
    .append('filter')
    .attr('id', 'jagged')
    .attr('x', '-20%')
    .attr('y', '-20%')
    .attr('width', '120%')
    .attr('height', '120%')
    .call((filter) => {
      filter
        .append('feTurbulence')
        .attr('type', 'turbulence')
        .attr('baseFrequency', '.18')
        .attr('numOctaves', 10)
        .attr('seed', 3)
        .attr('result', 'noise')
      filter
        .append('feDisplacementMap')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'noise')
        .attr('scale', 8)
        .attr('xChannelSelector', 'R')
        .attr('yChannelSelector', 'G')
    })

  defs
    .append('filter')
    .attr('id', 'jagged-blur')
    .attr('x', '-30%')
    .attr('y', '-30%')
    .attr('width', '160%')
    .attr('height', '160%')
    .call((filter) => {
      filter
        .append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', 3)
        .attr('result', 'blurred')

      filter
        .append('feColorMatrix')
        .attr('in', 'blurred')
        .attr('type', 'matrix')
        .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
    })

  //Lines
  const link = svg
    .append('g')
    .selectAll('path')
    .data(links)
    .join('path')
    // .attr('stroke-width', (d) => (!d.boundary ? 6 : 8))
    .attr('stroke-width', 8)
    .attr('stroke-dasharray', (d) => (!d.reconsider ? '5,5' : 'none'))

  //Nodes.
  const node = svg
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation))
  let remaining = [...colors]
  function pickRandomColor() {
    if (remaining.length === 0) remaining = [...colors]
    let i = Math.floor(Math.random() * remaining.length)
    return remaining.splice(i, 1)[0]
  }

  //Circle
  node
    .append('circle')
    .attr('fill', (d) => (d.group === 'inner' ? '#eaedd4' : '#ACBED8'))
    .attr('r', (d) => (d.group === 'inner' ? 90 : radius))
    .attr('cx', (i) => 200 * i + 1)
    .attr('fill', (d) => (d.group === 'inner' ? '#e6d6a8' : pickRandomColor()))
    .attr('stroke-width', (d) => (details.god && d.group === 'inner' ? 10 : 0))
    .attr('stroke', (d) =>
      details.god && d.group === 'inner' ? '#FFD700' : '#ffdba5'
    )

  //Marriage covenant outline
  node
    .append('circle')
    .attr('r', (d) => (d.group === 'inner' ? 80 : radius))
    .attr('fill', 'none')
    .attr('stroke-width', (d) =>
      details.covenant && d.group === 'inner' ? 10 : 0
    )
    .attr('stroke', (d) =>
      details.covenant && d.group === 'inner' ? '#1eb534' : 'none'
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
    .attr('transform', (_, i) => {
      let distance = 70
      if (details.alignment === '25%') {
        distance = 80
      } else if (details.alignment === '50%') {
        distance = 70
      } else if (details.alignment === '75%') {
        distance = 60
      }
      return `translate(${i === 0 ? -(distance - radius) : distance - radius}, 0)`
    })
  innerPerson
    .append('circle')
    .attr('r', radius)
    .attr('fill', () => pickRandomColor())
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

  function nodeHasChaos(chaos, name) {
    console.log(chaos.split(','), name)
    return chaos.split(',').some((person) => {
      return cap(person.trim()) === cap(name.trim())
    })
  }
  function cap(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  //Chaos outline
  node
    .append('circle')
    .attr('r', (d) => (d.group === 'inner' ? 80 : radius))
    .attr('fill', 'none')
    .attr('stroke-width', (d) => (nodeHasChaos(details.chaos, d.name) ? 5 : 0))
    .attr('stroke', (d) =>
      nodeHasChaos(details.chaos, d.name) ? '#d8332a' : 'none'
    )

  //Event Listeners
  simulation.on('tick', () => {
    link
      .attr('d', (d) => {
        return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`
      })
      .attr('filter', (d) => (d.boundary ? 'none' : 'url(#jagged)'))
      .attr('style', (d) => console.log('dee', d))
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
        // .attr('stroke', (d) => (links[0].quality ? goodColor : badColor))
        .attr('stroke-width', (d) => (links[0].reconsider ? 2.5 : 8))
        .attr('stroke-dasharray', (d) => (links[0].boundary ? '3,3' : 'none'))
    },
  })
}
