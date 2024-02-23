import { consume } from "@lit/context";
import type { SlDialog } from "@shoelace-style/shoelace";
import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { settingsContext, type Settings } from "./settings";

@customElement("pg-settings-dialog")
export class SettingsDialog extends LitElement {
  @query("sl-dialog") dialog!: SlDialog;
  @query(".openai-key-input") openaiKeyInput!: HTMLInputElement;

  @consume({ context: settingsContext })
  settings!: Settings;

  @state()
  openAIKey = "";

  static styles = css`
    :host {
      display: block;
    }

    sl-dialog {
      --width: 40rem;
    }

    sl-dialog::part(header) {
      border-bottom: 1px solid var(--sl-panel-border-color);
    }

    .settings-body > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  `;

  async connectedCallback(): Promise<void> {
    await super.connectedCallback();
  }

  render() {
    return html`
      <sl-dialog label="Settings">
        <div class="settings-body">
          <sl-input
            label="OpenAI key"
            class="openai-key-input"
            placeholder="sk-..."
            value=${this.openAIKey}
            @sl-input=${async () => {
              let key = this.openaiKeyInput.value;
              await this.settings.setOpenAIKey(key);
            }}>
            <div slot="help-text">
              Get your API key from <a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI</a>
            </div>
          </sl-input>
        </div>
        <sl-button slot="footer" variant="primary" @click=${() => this.hide()}>Save</sl-button>
      </sl-dialog>
    `;
  }

  async show() {
    this.openAIKey = await this.settings.queryOpenAIKey();
    this.dialog.show();
  }

  async hide() {
    this.dialog.hide();
  }
}
