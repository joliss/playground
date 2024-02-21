import "@shoelace-style/shoelace/dist/components/button/button";
import "@shoelace-style/shoelace/dist/components/dialog/dialog";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown";
import "@shoelace-style/shoelace/dist/components/icon/icon";
import "@shoelace-style/shoelace/dist/components/input/input";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item";
import "@shoelace-style/shoelace/dist/components/menu/menu";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "./Editor";
import { sampleMessage } from "./sample-message";
import "./SettingsDialog";
import { type SettingsDialog } from "./SettingsDialog";

setBasePath("/shoelace");

@customElement("pg-message")
export class Message extends LitElement {
  @property({ type: String })
  messageRole = "assistant";

  @property({ type: String })
  content = "";

  static styles = css`
    :host {
      display: block;
    }

    .message-container {
      display: flex;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;

      & > * {
        align-items: stretch;
      }

      &:hover {
        background-color: #eee;
      }

      &:focus-within {
        background-color: #eee;
        ::part(editor-container) {
          background-color: #fff;
        }
      }
    }

    .message-role {
      display: flex;
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
    }
  `;

  render() {
    let placeholder =
      this.messageRole === "system" ? "Enter a system message here."
      : this.messageRole === "user" ? "Enter a user message here."
      : "Enter an assistant message here.";
    return html`
      <div class="message-container">
        <div class="message-role">${this.messageRole}</div>
        <div class="message-content">
          <pg-editor content=${this.content} placeholder=${placeholder}></pg-editor>
        </div>
      </div>
    `;
  }
}

@customElement("pg-app")
class App extends LitElement {
  @query(".message-list") messageList!: HTMLDivElement;
  @query("pg-settings-dialog") settingsDialog!: SettingsDialog;

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => {
      // this.messageList.scrollTop = this.messageList.scrollHeight;
    });
  }

  static styles = css`
    :host {
      display: block;
    }

    .container {
      inset: 0;
      position: fixed;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    header {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #eee;

      & > * {
        margin-top: auto;
        margin-bottom: auto;
      }

      h1 {
        font-size: 1.5rem;
        margin-top: auto;
        margin-bottom: auto;
        padding-left: 1rem;
        padding-right: 1rem;
        font-weight: bold;
        color: #333;
      }

      .spacer {
        flex-grow: 1;
      }

      sl-dropdown {
        margin: 0.5rem;

        & > * {
          width: 160px;
        }
      }
    }

    main {
      flex-grow: 1;
      /* Stop children from expanding the flex item's height past its maximum.
      https://stackoverflow.com/a/43809765/525872 */
      min-height: 0;
    }

    .message-list {
      height: 100%;
      overflow: auto;

      & > *:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }
    }
  `;

  render() {
    return html`
      <pg-settings-dialog></pg-settings-dialog>
      <div class="container">
        <header>
          <h1>Playground</h1>
          <div class="spacer"></div>
          <div>
            <sl-dropdown>
              <sl-button slot="trigger" size="medium" caret> <sl-icon name="list"></sl-icon> Menu </sl-button>
              <sl-menu>
                <sl-menu-item @click=${() => this.settingsDialog.show()}>
                  Settings
                  <sl-icon slot="prefix" name="gear"></sl-icon>
                </sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </div>
        </header>
        <main>
          <div class="message-list">
            <pg-message messageRole="system"></pg-message>
            <pg-message
              messageRole="user"
              content="In Solid.js can I retrieve the root element in onMount? Or do I need to put a ref?"></pg-message>
            <pg-message messageRole="assistant" content=${sampleMessage}></pg-message>
          </div>
        </main>
      </div>
    `;
  }
}

export default App;
