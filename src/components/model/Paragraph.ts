import { Text } from "slate";

import ElementNode from "./ElementNode";

export default class Paragraph extends ElementNode {
  public children: Text[];
  constructor(public id: string, { text }: ParagraphInit) {
    super();
    this.children = [{ text }];
  }
  public init(text: string) {
    this.setText(text);
  }
  public setText(text: string) {
    this.children.push({ text });
  }
  public plainObject() {
    return {
      id: this.id,
      type: "paragraph",
      children: this.children,
    };
  }
}

export type ParagraphInit = { text: string };
