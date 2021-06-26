export function flattenData(tree: Record<string, any>, result: any) {
  if (!tree.attrs || !tree.attrs.nodeid) {
    return tree;
  }
  const obj: any = { id: tree.attrs.nodeid, type: tree.type };
  obj.children = (tree.content || []).map((t: any) => flattenData(t, result));
  result.push(obj);
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

function getTree(mapData: any, key: string) {
  console.log(key);
  const obj = { ...mapData[key] };
  if (!obj || !obj.children) {
    console.log("invalid key", key);
    return null;
  }
  obj.content = obj.children.map((c: any) =>
    obj.type !== "paragraph" ? getTree(mapData, c) : c
  );
  // obj.children = undefined;
  return obj;
}
