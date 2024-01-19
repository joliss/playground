export const sampleMessage = `In SolidJS, when you want to access the root element of a component, using a \`ref\` is indeed the common approach. The \`onMount\` lifecycle function in SolidJS is typically used for running code after the component is mounted, but it doesn't directly provide access to the DOM elements of the component.

Here's how you can use a \`ref\` to access the root element:

1. Define a \`ref\` using the \`createRef\` function.
2. Assign this \`ref\` to the _root element_ of your component.
3. In the \`onMount\` function, you can then access this \`ref\` to get the root element.

Here's an example:

\`\`\`javascript
import { createSignal, onMount, createRef } from 'solid-js';

function MyComponent() {
  const rootRef = createRef();

  onMount(() => {
    console.log(rootRef.current); // Access the root element here
  });

  return (
    <div ref={rootRef}>
      {/* Content of your component */}
    </div>
  );
}

export default MyComponent;
\`\`\`

In this example, \`rootRef.current\` will give you access to the \`<div>\` element that is the root of \`MyComponent\` after the component is mounted. This is a handy way to interact with the DOM directly in SolidJS components, especially when you need to integrate with non-reactive libraries or APIs.`;
