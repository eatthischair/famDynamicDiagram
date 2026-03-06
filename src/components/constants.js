import * as d3 from 'npm:d3';

export let people = {
  inner: ['Jane & John'],
  middle: ['John Jr', 'Scatman'],
  outer: ['Abraham', 'Karl', 'Aids'],
};

export let allPeople = Object.entries(people).flatMap(([group, person]) =>
  person.map((name) => ({ name: name, group: group }))
);

export function makeLinks(people = allPeople) {
  let data = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      if (Math.random() > 0) {
        data.push({
          source: people[i],
          target: people[j],
          reconsider: j > people.length / 2 ? false : true,
          quality: j > people.length / 2 ? true : false,
          boundary: j < people.length / 2 ? true : false,
        });
      }
    }
  }

  let parents;
  for (var node of people) {
    if (node.group === 'inner') {
      parents = node.name.split('&');
    }
  }

  data.unshift({
    source: { name: parents[0], group: 'inner' }, // name of first inner circle
    target: { name: parents[1], group: 'inner' }, // name of second inner circle
    reconsider: false,
    quality: true,
    boundary: false,
  });
  return data;
}

export const hardCodedArcs = [
  'M -100,-300  A 20,20 0,0,0 100,-300',
  'M -300,-300  A 20,20 0,0,0 300,-300',
  'M -500,-300  A 20,20 0,0,0 500,-300',
];

export const height = 1000;
export const width = 1000;
export const radius = 30.5;
export const radii = [0, 200, 400];
export const details = {
  covenant: true,
  god: true,
};

export function sortPeople(person) {
  if (person.group === 'inner') {
    return radii[0];
  }
  if (person.group === 'middle') {
    return radii[1];
  }
  if (person.group === 'outer') {
    return radii[2];
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

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}
