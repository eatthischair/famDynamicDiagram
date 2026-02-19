import * as d3 from "npm:d3";

export const people = {
  inner: ["Jane & John"],
  middle: ["John Jr", "Janie", "Farm", "Scatman"],
  outer: ["Nicolette", "Guy", "Karl"],
  }

export const allPeople =(Object.entries(people)
  .flatMap(([group, person]) => person
  .map(name => ({ name: name, group: group })
    ))
  )

export function formatPeople(people) {
  let formatted = Object.entries(people)
  .flatMap(([group, person]) => person
  .map(name => ({ name: name, group: group })
    ));
  return formatted || [];
}
export const nodes = allPeople

function makeLinks() {
 let data = []
 for (let i = 0; i < allPeople.length; i++) {
    for (let j = i + 1; j < allPeople.length; j++) {
      if ( Math.random() > 0.1) {
        data.push ({
        source: allPeople[i],
        target: allPeople[j],
        reconsider: Math.random() > 0.10 ? false : true,
        quality: Math.random() > 0.10 ? true : false,
        boundary: Math.random() > 0.80 ? true : false
        })
      }
    }
  }
  return data
}
export const links = makeLinks(allPeople);


export const height = 1000;
export const width = 1000;
export const radius = 30.5
export const radii = [0, 200, 400];
export const details = ({
    "covenant" : true,
    "god": true,
  })


export function midpoint(a, b) {
    return (a + b) / 2
  }


export function sortPeople(person) {
    if (person.group === "inner") {
      return radii[0]
    }
    if (person.group === "middle") {
      return radii[1]
    }
    if (person.group === "outer") {
      return radii[2]
    }
  }


export function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
