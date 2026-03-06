import * as Plot from 'npm:@observablehq/plot';
import * as d3 from 'npm:d3';
import {
  height,
  width,
  radius,
  details,
  allPeople,
  sortPeople,
  drag,
  hardCodedArcs,
} from '/components/constants.js';
import { createRgbaString } from '/components/pure.js';
export function Chart(
  color = 'black',
  invalidation = null,
  rgbaBad = null,
  rgbaGood = null,
  fam,
  links
) {
  let nodes = allPeople;

  // nodes.shift();
  // nodes.push(
  //   { name: 'Jane', group: 'inner' },
  //   { name: 'John', group: 'inner' }
  // );
  console.log('struct clone nodes', structuredClone(nodes));
  // console.log('struct clone', structuredClone(links));
  // links.push({
  //   boundary: true,
  //   quality: true,
  //   reconsider: true,
  //   source: { name: 'Jane', group: 'inner' },
  //   target: { name: 'John', group: 'inner' },
  // });
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'radial',
      d3.forceRadial((d, i) => sortPeople(d), 0, -300)
    )
    .force(
      'charge',
      d3
        .forceCollide()
        .radius(radius + 20)
        .iterations(10000)
    )
    .alphaDecay(0.03);

  // Create the container SVG.
  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto;');

  //ARCs
  svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', color)
    .selectAll('path')
    .data(hardCodedArcs)
    .join('path')
    .attr('d', (d, i) => hardCodedArcs[i]);

  // Append lines
  const link = svg
    .append('g')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr('stroke', (d) => determineLinkColor(d))
    .attr('stroke-width', (d) => (d.reconsider ? 2.5 : 8))
    .attr('stroke-dasharray', (d) => (d.boundary ? '5,5' : 'none'));

  function determineLinkColor(l) {
    let badColor = createRgbaString(rgbaBad);
    let goodColor = createRgbaString(rgbaGood);
    if (l.quality && !l.reconsider) return goodColor;
    if (l.quality && l.reconsider) return goodColor;
    if (!l.quality && l.reconsider) return badColor;
    if (!l.quality && !l.reconsider) return badColor;
  }

  // Append nodes.
  const node = svg
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(drag(simulation));

  //Circle
  node
    .append('circle')
    // .attr('fill', (d) =>
    //   details.covenant && d.group === 'inner' ? '#e4d4b7' : '#fff'
    // )
    .attr('fill', (d) => (d.group === 'inner' ? '#e7e5e5' : '#bbbbbb'))
    .attr('stroke', '#bbb')
    .attr('stroke-width', (d) =>
      details.covenant && d.group === 'inner' ? 0 : 1.5
    )
    .attr('r', (d) => (d.group === 'inner' ? 80 : radius))
    .attr('cx', (i) => 200 * i + 1);

  const innerPerson = node
    .filter((d) => d.group === 'inner')
    .append('g')
    .selectAll('.innerPerson')
    .data((d) => d.name.split('&').map((n) => n.trim()))
    .enter()
    .append('g')
    .attr(
      'transform',
      (_, i) => `translate(${i === 0 ? -(80 - radius) : 80 - radius},0)`
    );
  innerPerson
    .append('circle')
    .attr('r', radius)
    .attr('fill', (_, i) => (i === 0 ? '#989898' : '#a09f9f'));
  innerPerson
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '12px')
    .text((d) => d);
  node
    .filter((d) => d.group === 'inner')
    .append('path')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('d', `M${-(80 - radius - 30)},0 L${80 - radius - 30},0`)
    .attr('stroke', determineLinkColor(links[0]))
    .attr('stroke-width', (d) => (links[0].reconsider ? 2.5 : 8))
    .attr('stroke-dasharray', (d) => (links[0].boundary ? '3,3' : 'none'));

  //Text
  node
    .append('text')
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d) => (d.group !== 'inner' ? d.name : ''));

  //Event Listeners
  simulation.on('tick', () => {
    link.attr('d', (d) => {
      return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
    });
    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('transform', (d) => `translate(${d.x},${d.y})`);
  });

  invalidation.then(() => simulation.stop());
  return svg.node();
}
