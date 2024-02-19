import { onMount, type Component, type JSX, onCleanup, createSignal, createEffect } from "solid-js";
import { sampleMessage } from "./sample-message";
import "@shoelace-style/shoelace/dist/components/icon/icon";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown";
import "@shoelace-style/shoelace/dist/components/button/button";
import "@shoelace-style/shoelace/dist/components/menu/menu";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item";
import "@shoelace-style/shoelace/dist/components/dialog/dialog";
import "@shoelace-style/shoelace/dist/themes/light.css";

import "./solid-support";
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
  let [focused, setFocused] = createSignal(false);

  return (
    <div
      class="flex *:item-start px-4 py-3 hover:bg-gray-50"
      classList={{ "bg-gray-50 [&_.cm-editor]:bg-white": focused() }}>
      <div class="flex-initial min-w-20 uppercase text-xs font-bold text-gray-800 leading-4 py-[10px]">{role}</div>
      <div class="flex-grow">
        <Editor content={props.content} placeholder={placeholder} setFocused={setFocused} />
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
    <>
      <main class={`${styles.fullscreen} flex flex-col *:item-start`}>
        <div class="flex flex-row border-b border-gray-100">
          <h1 class="text-2xl my-auto px-4 font-bold text-gray-800">Playground</h1>
          <div class="flex-grow"></div>
          <div class="my-auto">
            <sl-dropdown class="m-1 *:w-40">
              <sl-button slot="trigger" prop:size="medium" prop:caret={true}>
                <sl-icon prop:name="list"></sl-icon> Menu
              </sl-button>
              <sl-menu>
                <sl-menu-item>
                  Settings
                  <sl-icon slot="prefix" prop:name="gear"></sl-icon>
                </sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </div>
        </div>
        <div class="grow overflow-auto *:border-b [&>:not(:last-child)]:border-gray-200" ref={messageListElement!}>
          <Message messageRole="system" />
          <Message
            messageRole="user"
            content="In Solid.js can I retrieve the root element in onMount? Or do I need to put a ref?"
          />
          <Message messageRole="assistant" content={sampleMessage} />
        </div>
      </main>
    </>
  );
};

export default App;
