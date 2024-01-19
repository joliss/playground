import { onMount, type Component, type JSX, onCleanup } from "solid-js";
import { basicSetup } from "codemirror";
import { sampleMessage } from "./sample-message";

import * as styles from "./App.styles";
import { Editor } from "./Editor";

type MessageProps = {
  messageRole: string;
  content?: string;
};

const Message: Component<MessageProps> = (props) => {
  let role = props.messageRole;
  let placeholder =
    role === "system" ? "Enter a system message here."
    : role === "user" ? "Enter a user message here."
    : "Enter an assistant message here.";

  return (
    <div class="flex *:item-start py-4">
      <div class="flex-initial min-w-20 uppercase text-xs font-bold text-gray-800 leading-4 py-[8px]">{role}</div>
      <div class="flex-grow">
        <Editor content={props.content} placeholder={placeholder} />
      </div>
    </div>
  );
};

const App: Component = () => {
  let messageListElement: HTMLDivElement;

  onMount(() => {
    setTimeout(() => {
      // messageListElement.scrollTop = messageListElement.scrollHeight;
    });
  });

  return (
    <main class={`${styles.fullscreen} flex flex-col *:px-4 *:item-start`}>
      <h1 class="text-2xl py-2 font-bold border border-b-gray-100 text-gray-800">Playground</h1>
      <div class="grow overflow-auto *:border-b [&>:not(:last-child)]:border-gray-200" ref={messageListElement!}>
        <Message messageRole="system" />
        <Message
          messageRole="user"
          content="In Solid.js can I retrieve the root element in onMount? Or do I need to put a ref?"
        />
        <Message messageRole="assistant" content={sampleMessage} />
      </div>
    </main>
  );
};

export default App;
