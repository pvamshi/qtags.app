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

export function buildTree(data: any[]) {
  const mapData = data.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  console.log({ mapData });
  return getTree(mapData, "root");
}

export function getTree(mapData: any, key: string) {
  console.log(key);

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
