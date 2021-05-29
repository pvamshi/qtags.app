import { nanoid } from "nanoid";
import List, { ListInit } from "./List";
import ListItem, { ListItemInit } from "./ListItem";
import Paragraph, { ParagraphInit } from "./Paragraph";
export function createNode(type: "paragraph", init: ParagraphInit): Paragraph;
export function createNode(type: "list", init: ListInit): List;
export function createNode(type: "list-item", init: ListItemInit): ListItem;
export function createNode(
  type: "paragraph" | "list" | "list-item",
  init: ParagraphInit | ListInit | ListItemInit
): Paragraph | List | ListItem {
  if (type === "paragraph") {
    return new Paragraph(nanoid(), init as ParagraphInit);
  } else if (type === "list-item") {
    return new ListItem(nanoid());
  } else {
    return new List(nanoid(), init as ListInit);
  }
}
