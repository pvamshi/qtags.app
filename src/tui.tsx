import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "prismjs/themes/prism.css";

import { PluginContext, PluginInfo } from "@toast-ui/editor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import { Editor } from "@toast-ui/react-editor";
import { nanoid } from "nanoid";
import Prism from "prismjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorState, Plugin, TextSelection } from "prosemirror-state";
import debounce from "debounce";
import { DOMParser, Node, Schema } from "prosemirror-model";

import { buildTree, flattenData } from "./persistance";
import { EditorView } from "prosemirror-view";

const saveToDB = debounce((id: string, file: string, data: any) => {
  // console.log("writing data", id, file, data);
  const fin: any[] = [];
  flattenData({ attrs: { nodeid: "root" }, ...data }, fin);
  console.log(fin);
  // console.log(JSON.stringify(buildTree(fin)));
  // firebase
  //   .database()
  //   .ref(`nodes/${id}/${file}`)
  //   .set(replaceAttr(data))
  //   .then(() => {
  //     console.log("done writinf");
  //   });
}, 1000);
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
      getJSON: (cb, state) => {
        // cb(state.toJSON());
        console.log(cb);
        return false;
      },
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

const MyComponent = () => {
  const ref = useRef<Editor>(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) return;
    if (ref && ref.current !== null) {
      ref.current?.getInstance().exec("setJSON", {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: {
              htmlAttrs: null,
              classNames: null,
              nodeid: "DbwVGZ8FHvqnC8VfA9D9C",
            },
            content: [
              {
                type: "text",
                text: "Wow!",
              },
            ],
          },
        ],
      });
    }
  }, [ref.current, init, setInit]);
  return (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="100%"
      usageStatistics={false}
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }], idGen]}
      ref={ref}
      theme="dark"
      onChange={(...args) => {
        console.log(
          (ref.current as any).editorInst.mdEditor.view.state.toJSON()
        );
        console.log(
          (ref.current as any).editorInst.wwEditor.view.state.toJSON()
        );
        console.log(args);
        return args[0];
      }}
    />
  );
};

export default MyComponent;
