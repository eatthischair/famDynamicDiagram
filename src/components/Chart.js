import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {links, height, width, radius, radii, details, people, allPeople, nodes, midpoint, sortPeople, drag} from '/components/constants.js';
// import { invalidation } from "observablehq:stdlib";

export function Chart() {


  const simulation = d3.forceSimulation(nodes)
    .force("radial", d3
      .forceRadial((d, i) => sortPeople(d), 0, -300))
    .force("charge", d3.forceCollide().radius(radius + 50).iterations(10000))
    .alphaDecay(.03)

  // Create the container SVG.
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  let hardCodedArcs = [
     "M -100,-300  A 20,20 0,0,0 100,-300",
     "M -300,-300  A 20,20 0,0,0 300,-300",
     "M -500,-300  A 20,20 0,0,0 500,-300"
  ]

  svg.append("g")
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .selectAll("path")
    .data(hardCodedArcs)
    .join("path")
    .attr("d", (d, i) => hardCodedArcs[i])

  // Append lines
  const link = svg.append("g")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", d => determineLinkColor(d))
    .attr("stroke-width", d=> d.reconsider ? 2.5 : 8)
    .attr("stroke-dasharray", d => d.boundary ? "5,5" : "none")

  function determineLinkColor(l) {
    if (l.quality && !l.reconsider) return '#005f0259'
    if (l.quality && l.reconsider) return '#005F02'

    if (!l.quality && l.reconsider) return '#ff0000cc'
    if (!l.quality && !l.reconsider) return '#ff000066'
  }

  // Append nodes.
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
      .call(drag(simulation));

  //Circle
  node.append("circle")
    .attr("fill", d => details.covenant && d.group === "inner" ? "#e4d4b7" : "#fff")
    // .attr("fill", "none")
    .attr("stroke", "#bbb")
    .attr("stroke-width", d => details.covenant && d.group === "inner" ? 0:  1.5)
    .attr("r", d => d.group === "inner" ? 60 : radius)
    .attr("cx", i => 200 * i + 1)

  //Text
  node.append("text")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")// Control size here
    .text(d => d.name)

  //Event Listeners
  simulation.on("tick", () => {
    link.attr("d", d => {
      const mx = midpoint(d.source.x, d.target.x);
      const my = midpoint(d.source.y, d.target.y);

      return `M${d.source.x},${d.source.y} L${mx},${my} L${d.target.x},${d.target.y}`;
    });
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("transform", d => `translate(${d.x},${d.y})`)
  });

  // invalidation.then(() => simulation.stop());
  return svg.node();



}