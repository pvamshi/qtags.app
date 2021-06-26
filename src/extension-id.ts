import { Extension } from "@tiptap/core";
import { Mark } from "@tiptap/react";
import { nanoid } from "nanoid";
import { Plugin, PluginKey } from "prosemirror-state";

export const pluginKey = new PluginKey("idgen");

// export interface CharacterCountOptions {
//   limit?: number;
// }

const isTargetNodeOfType = (node, type) => node.type === type;

const isNodeHasAttribute = (node, attrName) =>
  Boolean(node.attrs && node.attrs[attrName]);

const attrName = "nodeid";

export const IDGenerator = Extension.create({
  name: "idgen",

  defaultOptions: {},

  addProseMirrorPlugins() {
    //     const { options } = this;

    return [
      new Plugin({
        key: pluginKey,
        appendTransaction: (transactions, prevState, nextState) => {
          const tr = nextState.tr;
          let modified = false;
          if (transactions.some((transaction) => transaction.docChanged)) {
            // Adds a unique id to a node
            nextState.doc.descendants((node, pos) => {
              const { text } = nextState.schema.nodes;
              if (
                !isTargetNodeOfType(node, text) &&
                !isNodeHasAttribute(node, attrName)
              ) {
                const attrs = node.attrs;
                tr.setNodeMarkup(pos, undefined, {
                  ...attrs,
                  [attrName]: nanoid(),
                });
                modified = true;
              }
            });
          }

          return modified ? tr : null;
        },
        // appendTransaction: (transactions, oldState, newState) => {
        //   //   const nodeid = this.editor.getNodeAttributes("paragraph");
        //   //   console.log({ nodeid });
        //   //   if (nodeid.nodeid === "default")
        //   //     // console.log(this.editor.state.selection.$anchor.pos);
        //   //     this.editor.commands.updateAttributes("paragraph", {
        //   //       nodeid: nanoid(),
        //   //     });
        //   //   const newTr = newState.tr;
        //   //   let modified = false;
        //   //   //   console.log("append ta");
        //   //   newState.doc.descendants((node, pos) => {
        //   //     if (node.type && node.type.name === "paragraph") {
        //   //       const { nodeid, ...rest } = node.attrs;
        //   //       //       console.log({ a: node.attrs });
        //   //       if (nodeid === "default") {
        //   //         const id = nanoid();
        //   //         console.log("setting id", id);
        //   //         // Adds a unique id to a node
        //   //         // console.log("updating attr");
        //   //         newTr.setNodeMarkup(pos, undefined, {
        //   //           nodeid: id,
        //   //           ...rest,
        //   //         });
        //   //         // newTr.setNodeMarkup;
        //   //         // newTr.addMark(pos, pos, new Mark({ name: "id" }));
        //   //         modified = true;
        //   //       }
        //   //     }
        //   //   });
        //   //   if (modified) {
        //   //     return newTr;
        //   //   }
        // },
      }),
    ];
  },
});
