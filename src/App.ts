import { provide } from "@lit/context";
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
import { customElement, query } from "lit/decorators.js";
import "./chat-interface";
import { Conversation, Message } from "./conversation";
import "./Editor";
import { sampleMessage } from "./sample-message";
import { Settings, settingsContext } from "./settings";
import "./SettingsDialog";
import { type SettingsDialog } from "./SettingsDialog";

setBasePath("/shoelace");

@customElement("pg-app")
class AppElement extends LitElement {
  @query("pg-settings-dialog") settingsDialog!: SettingsDialog;

  @provide({ context: settingsContext })
  settings = new Settings();

  connectedCallback(): void {
    super.connectedCallback();
    let fragmentString = window.location.hash.slice(1);
    if (fragmentString) {
      let fragment = new URLSearchParams(fragmentString);
      for (let [key, value] of fragment) {
        console.log(key, value);
      }
    }
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
      background-color: rgb(0, 0, 0, 0.05);

      & > * {
        margin-top: auto;
        margin-bottom: auto;
      }

      h1 {
        font-size: 1.2rem;
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
        margin: 0.25rem 0.5rem;

        & > * {
          width: 160px;
        }
      }
    }

    main {
      flex-grow: 1;
      min-height: 0;
    }
  `;

  render() {
    let sampleConversation = new Conversation([
      new Message("system", ""),
      new Message("user", "In Solid.js can I retrieve the root element in onMount? Or do I need to put a ref?"),
      new Message("assistant", sampleMessage),
    ]);

    return html`
      <pg-settings-dialog></pg-settings-dialog>
      <div class="container">
        <header>
          <h1>Playground</h1>
          <div class="spacer"></div>
          <div>
            <sl-dropdown>
              <sl-button slot="trigger" size="small" caret> <sl-icon name="list"></sl-icon> Menu </sl-button>
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
          <pg-chat-interface .conversation=${sampleConversation}></pg-chat-interface>
        </main>
      </div>
    `;
  }
}

export default AppElement;
