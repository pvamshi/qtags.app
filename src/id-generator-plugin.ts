import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "prismjs/themes/prism.css";

import { PluginContext, PluginInfo } from "@toast-ui/editor";
import { nanoid } from "nanoid";
import { Node } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";

function idGen(context: PluginContext, options?: any): PluginInfo {
  console.log({ context, options });
  const isTargetNodeOfType = (node: any, type: string) => node.type === type;

  const isNodeHasAttribute = (node: any, attrName: string) =>
    Boolean(node.attrs && node.attrs[attrName]);

  const attrName = "nodeid";

  const idGeni: Plugin = new context.pmState.Plugin({
    appendTransaction: (transactions, prevState, nextState) => {
      const { tr } = nextState;
      let modified = false;

      if (transactions.some((transaction) => transaction.docChanged)) {
        // Adds a unique id to a node
        nextState.doc.descendants((node, pos) => {
          const { text } = nextState.schema.nodes;

          if (
            !isTargetNodeOfType(node, text) &&
            !isNodeHasAttribute(node, attrName)
          ) {
            const { attrs } = node;

            // eslint-disable-next-line no-undefined
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
  });
  return {
    wysiwygPlugins: [() => idGeni],
    wysiwygCommands: {
      setJSON: (obj, state, dispatch, view) => {
        view.updateState(
          EditorState.create({
            schema: view.state.schema,
            doc: Node.fromJSON(view.state.schema, obj),
            plugins: view.state.plugins,
          })
        );
        return true;
      },
    },
    // DO NOT REMOVE THIS COMMENT
    // this is where we can add our own version of p, li with id and hashtag implementation
    // check code syntax highlight plugin for ex.
    // wysiwygNodeViews: {
    //   paragraph: (node) => {
    //     return node;
    //   },
    // },
  };
}

export default idGen;
