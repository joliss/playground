import type { SlDialog } from "@shoelace-style/shoelace";
import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("pg-settings-dialog")
export class SettingsDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .settings-body > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  `;

  @query("sl-dialog")
  dialog!: SlDialog;

  render() {
    return html`
      <sl-dialog label="Settings">
        <div class="settings-body">
          <sl-input label="OpenAI key" placeholder="sk-...">
            <div slot="help-text">
              Get your API key from <a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI</a>
            </div>
          </sl-input>
        </div>
        <sl-button slot="footer" variant="primary">Save</sl-button>
      </sl-dialog>
    `;
  }

  show() {
    this.dialog.show();
  }
}
