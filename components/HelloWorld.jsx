import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

export default function HelloWorld() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>Hello, There!</h1>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count()}</button>
    </div>
  );
}

render(() => <HelloWorld />, document.getElementById('HelloWorld'));
