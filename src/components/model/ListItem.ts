import ElementNode from "./ElementNode";

export type ListItemInit = undefined;

export default class ListItem extends ElementNode {
  public todo = false;
  public done = false;
  constructor(public id: string) {
    super();
  }
  public plainObject() {
    return {
      id: this.id,
      children: this.children,
      type: "list-item",
    };
  }
}
