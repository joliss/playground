import type { Component, JSX } from "solid-js";

import * as styles from "./App.styles";

type MessageProps = {
  messageRole: string;
  content?: string | JSX.Element;
};

const Message: Component<MessageProps> = (props) => {
  let role = props.messageRole;
  let placeholderContent = (
    <span class="text-slate-500">
      {role === "system" ?
        "Enter a system message here."
      : role === "user" ?
        "Enter a user message here."
      : "Enter an assistant message here."}
    </span>
  );

  return (
    <div class="flex *:item-start px-3 py-4">
      <div class="flex-initial min-w-20 uppercase text-xs font-bold leading-4 py-2">{role}</div>
      <div class="flex-grow py-1">{props.content || placeholderContent}</div>
    </div>
  );
};

const App: Component = () => {
  let a = <div></div>;
  return (
    <main class={`${styles.fullscreen} flex flex-col *:pl-4 *:item-start`}>
      <h1 class="text-2xl py-2 font-bold border border-b-slate-100">Playground</h1>
      <div class="grow overflow-auto">
        <Message messageRole="system" content="You are a helpful assistant." />
        <Message messageRole="user" />
      </div>
    </main>
  );
};

export default App;
