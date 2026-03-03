import { html } from 'npm:htl';

export function renderLinksForm(links) {
  return links.map((link) => {
    return {
      source: link.source.name,
      target: link.target.name,
      boundary: link.boundary ? 'good' : 'bad',
      reconsider: link.reconsider ? 'good' : 'bad',
      quality: link.quality ? 'good' : 'bad',
    };
  });
}

/*```js
function debounce(input, delay = 1000) {
  return Generators.observe((notify) => {
    let timer = null;
    let value;

    // On input, check if we recently reported a value.
    // If we did, do nothing and wait for a delay;
    // otherwise, report the current value and set a timeout.
    function inputted() {
      if (timer !== null) return;
      notify((value = input.value));
      timer = setTimeout(delayed, delay);
    }

    // After a delay, check if the last-reported value is the current value.
    // If it’s not, report the new value.
    function delayed() {
      timer = null;
      if (value === input.value) return;
      notify((value = input.value));
    }

    (input.addEventListener('input', inputted), inputted());
    return () => input.removeEventListener('input', inputted);
  });
}
```
*/
