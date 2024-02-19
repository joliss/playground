import type { JSX } from "solid-js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

// From https://github.com/shoelace-style/shoelace/discussions/770#discussioncomment-2852125
declare module "solid-js" {
  namespace JSX {
    type ElementProps<T> = {
      // Add both the element's prefixed properties and the attributes
      [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]>;
    };
    // Prefixes all properties with `prop:` to match Solid's property setting syntax
    type Props<T> = {
      [K in keyof T as `prop:${string & K}`]?: T[K];
    };
    interface IntrinsicElements extends ElementProps<HTMLElementTagNameMap> {}
  }
}

// From https://stackoverflow.com/a/76446465
setBasePath("/shoelace");
