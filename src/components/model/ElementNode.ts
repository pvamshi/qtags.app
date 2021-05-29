import { Text } from "slate";
import Paragraph from "./Paragraph";
export default abstract class ElementNode {
  public id: string;
  public children: (ElementNode | Text)[];
  public abstract plainObject(): {
    type: string;
    children: (ElementNode | Text)[];
    id: string;
  };
  constructor() {}
}
