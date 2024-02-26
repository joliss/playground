import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { HighlightStyle, bracketMatching, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorView, drawSelection, dropCursor, highlightSpecialChars, keymap, placeholder } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { LitElement, PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Ref, createRef, ref } from "lit/directives/ref.js";

// Create highlight style based on defaultHighlightStyle at
// https://github.com/codemirror/language/blob/ade6caa3e8e7d867adc2809989a82d43715c7a71/src/highlight.ts#L193
// with sans serif font. See also
// https://github.com/lezer-parser/markdown/blob/cf927e8142398d41b1c122e8a2827cd6e9e39eed/src/markdown.ts#L1880-L1903
// for the tags used by the markdown parser.
const monospaceFontSize = "14px";
const sansSerifFontFamily =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const sansSerifFontSize = "16px";
const sansSerif = {
  fontFamily: sansSerifFontFamily,
  fontSize: sansSerifFontSize,
};
const highlightStyle = HighlightStyle.define([
  { tag: tags.meta, color: "#404740" },
  { tag: tags.link, textDecoration: "underline", ...sansSerif },
  { tag: tags.heading, textDecoration: "underline", fontWeight: "bold", ...sansSerif },
  { tag: tags.emphasis, fontStyle: "italic", ...sansSerif },
  { tag: tags.strong, fontWeight: "bold", ...sansSerif },
  { tag: tags.strikethrough, textDecoration: "line-through", ...sansSerif },
  { tag: tags.keyword, color: "#708" },
  { tag: [tags.atom, tags.bool, tags.contentSeparator, tags.labelName], color: "#219" },
  { tag: tags.url, color: "#219", ...sansSerif },
  { tag: [tags.literal, tags.inserted], color: "#164" },
  { tag: [tags.string, tags.deleted], color: "#a11" },
  { tag: [tags.regexp, tags.escape, /*@__PURE__*/ tags.special(tags.string)], color: "#e40" },
  { tag: /*@__PURE__*/ tags.definition(tags.variableName), color: "#00f" },
  { tag: /*@__PURE__*/ tags.local(tags.variableName), color: "#30a" },
  { tag: [tags.typeName, tags.namespace], color: "#085" },
  { tag: tags.className, color: "#167" },
  { tag: [/*@__PURE__*/ tags.special(tags.variableName), tags.macroName], color: "#256" },
  { tag: /*@__PURE__*/ tags.definition(tags.propertyName), color: "#00c" },
  { tag: tags.comment, color: "#940" },
  { tag: tags.invalid, color: "#f00" },

  { tag: tags.content, ...sansSerif },
  { tag: tags.monospace, fontFamily: "monospace !important", fontWeight: "bold", fontSize: monospaceFontSize },
]);

@customElement("pg-editor")
export class EditorElement extends LitElement {
  @property({ type: String, attribute: false }) content?: string;
  @property({ type: String }) placeholder?: string;
  @property({ type: Boolean }) focused = false;

  editorRef: Ref<HTMLDivElement> = createRef();
  editorView: EditorView | null = null;

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (!this.editorRef.value) {
      throw new Error("editorRef not available.");
    }
    let focused = this.focused;
    this.editorView = new EditorView({
      doc: this.content || "",
      extensions: [
        highlightSpecialChars(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        // EditorState.allowMultipleSelections.of(true),
        // rectangularSelection(),
        // crosshairCursor(),
        indentOnInput(),
        syntaxHighlighting(highlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        placeholder(this.placeholder || ""),
        EditorView.lineWrapping,
        EditorView.focusChangeEffect.of((state, focused) => {
          this.focused = focused;
          return null;
        }),
      ],
      parent: this.editorRef.value!,
    });
    if (focused) {
      this.editorView.focus();
    }
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor-root,
    .cm-editor {
      /* .cm-editor needs border-radius for outline; .editor-root needs
      border-radius for background color. */
      border-radius: 8px;
    }

    .cm-editor {
      padding: 2px;
      color: #333;
      font-size: ${css`monospaceFontSize`};
      max-height: 100%;

      .editor-root:focus-within & {
        outline: 1px solid #999 !important;
      }
    }

    .cm-placeholder {
      /* Stops the editor height from changing slightly when you start typing
      into an empty editor. */
      vertical-align: baseline !important;
    }

    .cm-scroller {
      overflow-y: auto;
      /* Set fixed line-height because we intermingle different font sizes. */
      line-height: 24px !important;

      &::-webkit-scrollbar {
        appearance: none;
        width: 7px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 9999px;
        background-color: rgba(0, 0, 0, 0.15);
      }
    }

    .cm-placeholder {
      font-family: ${unsafeCSS(sansSerifFontFamily)};
      font-size: ${unsafeCSS(sansSerifFontSize)};
    }

    .cm-cursor {
      --cursor-width: 1.7px;
      border-left: var(--cursor-width) solid rgb(0, 0, 0, 0.8) !important;
      margin-left: calc(-0.5 * var(--cursor-width)) !important;
    }

    .cm-selectionBackground {
      background-color: highlight !important;
    }
  `;

  render() {
    return html`<div ${ref(this.editorRef)} class="editor-root" part="editor-root"></div>`;
  }
}
