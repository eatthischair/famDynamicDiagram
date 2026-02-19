# A year of chess rankings


```js
import {Chart} from "./components/Chart.js";
```


```js
const color = view(Inputs.text({label: "Replay", placeholder: "semi circle color", submit: true}));
const rgbaBad = view(Inputs.form({
  r: Inputs.range([0, 255], {step: 1, label: "r"}),
  g: Inputs.range([0, 255], {step: 1, label: "g"}),
  b: Inputs.range([0, 255], {step: 1, label: "b"}),
  a: Inputs.range([0, 1], {step: .01, label: "a"})
}));
```

```js
const rgbaGood = view(Inputs.form({
  r: Inputs.range([0, 255], {step: 1, label: "r"}),
  g: Inputs.range([0, 255], {step: 1, label: "g"}),
  b: Inputs.range([0, 255], {step: 1, label: "b"}),
  a: Inputs.range([0, 1], {step: .01, label: "a"})
  })
);
```

```js
const f = view(Inputs.form({
  inner: Inputs.text({label: "Couple", placeholder: "Name of parents", submit: true}),
  middle: Inputs.text({label: "Kids", placeholder: "Name of children", submit: true}),
  outer: Inputs.text({label: "Peripheral", placeholder: "Name of peripheral family", submit: true})
  })
);
const nodes = {
  inner: f.inner || '',
  middle: f.middle?.split(',') || '',
  outer: f.outer?.split(',') || ''
  }
  console.log('nodes', nodes)
```


<div class="grid">
  <div class="card">
  <h3>Hello, ${name || "anonymous"}!</h3>
    <h2>Top ten women players</h2>
    ${Chart(color, invalidation, rgbaBad, rgbaGood, f)}


  </div>
</div>
