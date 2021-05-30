import { Text } from "slate";

export interface ElementNode {
  id: string;
  type: string;
  children: (ElementNode | Text)[];
}
