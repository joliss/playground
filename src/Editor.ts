import { closeBrackets } from "@codemirror/autocomplete";
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
const sansSerifFontFamily =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const sansSerifFontSize = "16px";
const sansSerifLineHeight = "24px";
const sansSerif = {
  fontFamily: sansSerifFontFamily,
  fontSize: sansSerifFontSize,
  lineHeight: sansSerifLineHeight,
};
const monospaceFontSize = "14px";
// The monospace line-height must be a few pixels less than the sans-serif
// line-height. This is to avoid its virtual area extending past the sans-serif
// virtual area, causing the line-height to grow by 1-2 pixels when you mix
// fonts. See
// https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align
// figure 11 for a visual explanation:
// https://iamvdo.me/content/01-blog/30-css-avance-metriques-des-fontes-line-height-et-vertical-align/vertical-align-baseline-nok.png
// But don't set this too low or the cursor becomes too short.
const monospaceLineHeight = "18px";
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
  /* tags.monospace is for `inline code`, whereas ```code blocks``` are simply untagged */
  {
    tag: tags.monospace,
    fontFamily: "monospace !important",
    fontWeight: "bold",
    fontSize: monospaceFontSize,
    lineHeight: monospaceLineHeight,
  },
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
        keymap.of([...historyKeymap, ...defaultKeymap]),
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
      max-height: 100%;

      .editor-root:focus-within & {
        outline: 1px solid #999 !important;
      }
    }

    .cm-scroller {
      overflow-y: auto;

      &::-webkit-scrollbar {
        appearance: none;
        width: 7px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 9999px;
        background-color: rgba(0, 0, 0, 0.15);
      }
    }

    .cm-cursor {
      --cursor-width: 1.7px;
      border-left: var(--cursor-width) solid rgb(0, 0, 0, 0.8) !important;
      margin-left: calc(-0.5 * var(--cursor-width)) !important;
    }

    .cm-selectionBackground {
      background-color: highlight !important;
    }

    /* ## Font size and line height */

    /* Note: Also see the HighlightStyle code above for font configuration. */

    .cm-editor {
      /* This default font-size set by the .cm-editor parent applies to Markdown
      code blocks, which are untagged. */
      font-size: ${unsafeCSS(monospaceFontSize)};
      line-height: ${unsafeCSS(monospaceLineHeight)};
    }

    .cm-placeholder {
      font-family: ${unsafeCSS(sansSerifFontFamily)};
      font-size: ${unsafeCSS(sansSerifFontSize)};
      line-height: ${unsafeCSS(sansSerifLineHeight)};
      /* The vertical-align should perhaps be upstreamed. */
      vertical-align: baseline !important;
    }

    /* Empty .cm-lines get their line-height from the default
    monospaceLineHeight, which is too small. This causes the line to expand when
    you enter the first character. So we use ::before as a strut to ensure every
    line is at least sansSerifLineHeight high, even when empty. */
    .cm-line::before {
      font-family: ${unsafeCSS(sansSerifFontFamily)};
      font-size: ${unsafeCSS(sansSerifFontSize)};
      line-height: ${unsafeCSS(sansSerifLineHeight)};
      content: "";
    }
  `;

  render() {
    return html`<div ${ref(this.editorRef)} class="editor-root" part="editor-root"></div>`;
  }
}
