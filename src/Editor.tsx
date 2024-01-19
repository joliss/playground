import {
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  keymap,
  EditorView,
  placeholder,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentOnInput, syntaxHighlighting, HighlightStyle, bracketMatching } from "@codemirror/language";
import { history, defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
// import { lintKeymap } from "@codemirror/lint";
import { tags } from "@lezer/highlight";

import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { onCleanup, onMount } from "solid-js";
import { css } from "solid-styled-components";

// Create highlight style based on defaultHighlightStyle at
// https://github.com/codemirror/language/blob/ade6caa3e8e7d867adc2809989a82d43715c7a71/src/highlight.ts#L193
// with sans serif font. See also
// https://github.com/lezer-parser/markdown/blob/cf927e8142398d41b1c122e8a2827cd6e9e39eed/src/markdown.ts#L1880-L1903
// for the tags used by the markdown parser.
const monospaceFontSize = "14px";
const sansSerifFontSize = "16px";
const sansSerif = {
  // `class: "font-sans"` doesn't work here, as it suppressed the other CSS
  // properties. So we copy the definition from Tailwind:
  fontFamily:
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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

export const Editor = (props: { content?: string; placeholder?: string }) => {
  let editorElement: HTMLDivElement;
  let editorView: EditorView;

  onMount(() => {
    editorView = new EditorView({
      doc: props.content || "",
      // See
      // https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts
      // for a list of basic extensions
      extensions: [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(highlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        rectangularSelection(),
        crosshairCursor(),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        placeholder(props.placeholder || ""),
        EditorView.lineWrapping,
      ],
      parent: editorElement,
    });
  });

  onCleanup(() => {
    editorView.destroy();
  });

  let style = css`
    & .cm-editor {
      border-radius: 8px;
      font-size: ${monospaceFontSize};

      &.cm-focused {
        outline: 1px solid #14b8a6 !important; /* teal-500 */
      }
      &:not(.cm-focused) {
        cursor: pointer;
      }
    }

    .cm-placeholder {
      font-size: ${sansSerifFontSize};
    }

    /* Set fixed heights because we intermingle different fonts. */
    & .cm-scroller {
      line-height: 24px;
    }
    & .cm-cursor {
      height: 19px !important;
    }
  `;

  return <div ref={editorElement!} class={`${style} [&_.cm-placeholder]:font-sans text-gray-800`}></div>;
};
