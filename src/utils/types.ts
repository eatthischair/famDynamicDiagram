type rgbaObject = {
  r: Number
  g: Number
  b: Number
  a: Number
}

type input = {
  inner: string
  middle: string
  outer: string
}

type fam = {
  inner: string[]
  middle: string[]
  outer: string[]
}

interface Node {
  group: string
  index: number
  name: string
  vx: number
  vy: number
  x: number
  y: number
}

interface Link {
  boundary: boolean
  quality: boolean
  reconsider: boolean
  source: Node
  target: Node
}

type Input = {
  inner: string
  middle: string
  outer: string
}
