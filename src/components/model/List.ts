import ElementNode from "./ElementNode";

export default class List extends ElementNode {
  public ordered = false;
  public startingNumber = 1;

  public children: ElementNode[];
  constructor(public id: string, { ordered }: ListInit) {
    super();
    this.ordered = ordered;
  }
  public plainObject() {
    return {
      id: this.id,
      children: this.children,
      type: "list",
    };
  }
}

export type ListInit = { ordered: boolean };
