import type { EditorView } from "codemirror";
import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { EditorElement } from "./Editor";
import type { Conversation } from "./conversation";
import { sampleMessage } from "./sample-message";

@customElement("pg-message")
export class MessageElement extends LitElement {
  @property()
  messageRole = "assistant";

  @property({ type: Boolean })
  focused = false;

  @property({ attribute: false })
  content = "";

  @property()
  placeholder: string | null = null;

  @query("pg-editor") editor!: EditorElement;

  getEditorView(): EditorView {
    return this.editor.editorView!;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }

    .message-container {
      display: flex;
      flex-direction: row;
      --message-container-padding: 0.75rem;
      padding: var(--message-container-padding) 1rem;
      max-height: calc(100% - var(--message-container-padding) * 2);

      & > * {
        align-items: stretch;
      }

      &:focus-within {
        background-color: #eee;
        ::part(editor-root) {
          background-color: #fff;
        }
      }
    }

    .message-role {
      flex: 0 1 auto;
      min-width: 5rem;
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: bold;
      color: #333;
      line-height: 1rem;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .message-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }

    pg-editor {
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }
  `;

  getPlaceholder(): string {
    return (
      this.messageRole === "system" ? "Enter a system message here."
      : this.messageRole === "user" ? "Enter a user message here."
      : "Enter an assistant message here."
    );
  }

  render() {
    return html`
      <div class="message-container">
        <div class="message-role">${this.messageRole}</div>
        <div class="message-content">
          <pg-editor
            part="pg-editor"
            exportparts="editor-root"
            .content=${this.content}
            placeholder=${this.placeholder ?? this.getPlaceholder()}
            ?focused=${this.focused}></pg-editor>
        </div>
      </div>
    `;
  }
}

@customElement("pg-chat-input")
export class ChatInputElement extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }
  `;

  render() {
    return html`<pg-message
      part="message"
      exportparts="editor-root"
      messageRole="user"
      placeholder="Message the assistant..."
      .content=${sampleMessage}
      focused></pg-message>`;
  }
}

@customElement("pg-message-list")
export class MessageListElement extends LitElement {
  @query(".message-list") messageList!: HTMLDivElement;

  @property({ attribute: false })
  conversation!: Conversation;

  static styles = css`
    :host {
      display: block;
    }

    .message-list > *:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  `;

  render() {
    let messages = this.conversation.messages;
    return html`<div class="message-list">
      ${messages.map(
        (message) => html`<pg-message messageRole=${message.role} .content=${message.content}></pg-message>`,
      )}
    </div>`;
  }
}

@customElement("pg-chat-interface")
export class ChatInterfaceElement extends LitElement {
  @property({ attribute: false })
  conversation!: Conversation;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .scroller {
      overflow-y: auto;
      height: 100%;
      max-height: 100%;
      display: flex;
      flex-direction: column-reverse;
      overflow-anchor: auto;
    }

    main {
      /* Stop children from expanding the flex item's height past its maximum.
      https://stackoverflow.com/a/43809765/525872 */
      min-height: 0;
    }

    .spacer {
      flex-grow: 1;
    }

    footer {
      max-height: max(calc(100% - 150px), 150px);
      /* We set flex here and on its descendants all the way to the editor so we
      can dynamically size based on the editor's content height, while still
      enforcing a max-height. */
      display: flex;
      flex-direction: column;
      border-top: 1px solid #eee;

      ::part(editor-root) {
        height: 100%;
      }
    }
  `;

  render() {
    return html`
      <main>
        <div class="scroller">
          <pg-message-list .conversation=${this.conversation}></pg-message-list>
        </div>
      </main>
      <div class="spacer"></div>
      <footer>
        <pg-chat-input></pg-chat-input>
      </footer>
    `;
  }
}
