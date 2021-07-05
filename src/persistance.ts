export function flattenData(tree: Record<string, any>, result: any) {
  if (tree.type !== "doc" && (!tree.attrs || !tree.attrs.nodeid)) {
    return tree;
  }
  const obj: any = {
    id: tree.type === "doc" ? "doc" : tree.attrs.nodeid,
    type: tree.type,
  };
  if (tree.type !== "doc") obj.attrs = tree.attrs;
  obj.children = (tree.content || []).map((t: any) => flattenData(t, result));
  result[obj.id] = obj;
  return obj.id;
}

function buildTree(data: any[]) {
  const mapData = data.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  console.log({ mapData });
  return getTree(mapData, "root");
}

export function getTree(mapData: any, key: string) {
  const obj = { ...mapData[key] };
  if (!obj || !obj.children) {
    return obj;
  }
  obj.content = obj.children.map((c: any) =>
    typeof c !== "string" ? c : getTree(mapData, c)
  );
  obj.children = undefined;
  return obj;
}

export function replaceAttr(obj: Record<string, any>) {
  if (obj.hasOwnProperty("attrs")) {
    obj.attrs = JSON.stringify(obj["attrs"]);
  }
  // if (obj.content) {
  //   obj.content = obj.content.map((c: any) => replaceAttr(c));
  // }
  return Object.entries(obj).reduce<Record<string, any>>((acc, [id, curr]) => {
    console.log("a", curr["attrs"]);
    if (curr["attrs"]) {
      const js = JSON.stringify(curr["attrs"]);
      curr.attrs = js;
    }
    acc[id] = curr;
    return acc;
  }, {});
}

export function revertAttr(obj: any) {
  if (!obj) {
    return obj;
  }
  if (obj.hasOwnProperty("attrs")) {
    obj.attrs = JSON.parse(obj["attrs"]);
  }
  if (obj.content) {
    obj.content = obj.content.map((c: any) => revertAttr(c));
  }
  return obj;
}
