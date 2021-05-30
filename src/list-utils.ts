import { Node, Path, Element as SlateElement } from "slate";
import { ElementNode } from "./models";
export function isList(node: [ElementNode, Path] | undefined) {
  return (
    node &&
    node.length > 0 &&
    SlateElement.isElement(node[0]) &&
    node[0].type === "list-item" &&
    Node.string(node[0]) === "- "
  );
}
