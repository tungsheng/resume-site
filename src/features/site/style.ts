import { baseStyles } from "./styles/base";
import { contentStyles } from "./styles/content";
import { evidenceStyles } from "./styles/evidence";
import { shellStyles } from "./styles/shell";

export const siteStyles = [
  baseStyles,
  shellStyles,
  contentStyles,
  evidenceStyles,
].join("\n");
