import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { BlockNodeType } from "@toast-ui/editor/types/toastmark";

import { Plugin, PluginKey } from "prosemirror-state";
import { Editor } from "@toast-ui/react-editor";
import { PluginContext, PluginInfo, Dispatch } from "@toast-ui/editor";
import React, { useCallback, useEffect, useRef } from "react";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { EditorState } from "prosemirror-state";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

import { TextSelection } from "prosemirror-state";
import {
  Schema,
  Node as ProseMirrorNode,
  ParseOptions,
  DOMParser,
} from "prosemirror-model";
import { nanoid } from "nanoid";

// const isTargetNodeOfType = (node, type) => node.type === type;

// const isNodeHasAttribute = (node, attrName) =>
//   Boolean(node.attrs && node.attrs[attrName]);

const attrName = "nodeid";
function idGen(context: PluginContext, options?: any): PluginInfo {
  console.log({ context, options });
  const isTargetNodeOfType = (node: any, type: string) => node.type === type;

  const isNodeHasAttribute = (node: any, attrName: string) =>
    Boolean(node.attrs && node.attrs[attrName]);

  const attrName = "nodeid";

  const idGeni = new context.pmState.Plugin({
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

// interface PluginInfo {
//   toHTMLRenderers?: HTMLConvertorMap;
//   toMarkdownRenderers?: ToMdConvertorMap;
//   markdownPlugins?: PluginProp[];
//   wysiwygPlugins?: PluginProp[];
//   wysiwygNodeViews?: NodeViewPropMap;
//   markdownCommands?: PluginCommandMap;
//   wysiwygCommands?: PluginCommandMap;
//   toolbarItems?: PluginToolbarItem[];
// }

// const pluginResult: PluginInfo = {
//   // ...
// }

function customPlugin(): PluginInfo {
  // ...
  return {};
}
function useHookWithRefCallback() {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (ref.current && node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.

      const state = (ref.current as any).editorInst.mdEditor.view
        .state as EditorState;
      console.log("adding apply");
    }

    // Save a reference to the node
    ref.current = node;
  }, []);

  return [ref, setRef];
}

const tagRe = /([\s])(\#\w+)([\s])/;

const MyComponent = () => {
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const obj = (ref.current as any).editorInst.wwEditor.view.state.toJSON();

      const state = (ref.current as any).editorInst.wwEditor.view
        .state as EditorState;
      const selection = TextSelection.create(
        state.doc,
        0,
        state.doc.content.size
      );
      const schema = (ref.current as any).editorInst.wwEditor.schema as Schema;
      const parser = DOMParser.fromSchema(
        (ref.current as any).editorInst.wwEditor.schema
      );
      const plugins = state.plugins;
      // (ref.current as any).editorInst.wwEditor.view.dispatch(
      //   state.tr
      //     // .replaceRangeWith(
      //     // (ref.current as any).editorInst.mdEditor.view.state.selection
      //     //   .$anchor.pos,
      //     .setSelection(selection)
      //     .replaceSelectionWith(
      //       schema.nodeFromJSON({
      //         type: "bulletList",
      //         attrs: { className: "id:124" },
      //         content: [
      //           {
      //             type: "listItem",
      //             attrs: { className: "id:123" },
      //             content: [
      //               {
      //                 type: "paragraph",
      //                 content: [{ type: "text", text: "Wow !!" }],
      //               },
      //             ],
      //           },
      //         ],
      //       }),
      //       true
      //     )
      // );
      // ;

      // console.log("reconfiguring");
      // state.reconfigure({ plugins: [...state.plugins, plug] });
    }, 5000);
  }, []);
  return (
    <Editor
      initialValue="hello react editor world!"
      previewStyle="vertical"
      height="100%"
      usageStatistics={false}
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      // customHTMLRenderer={{
      //   paragraph(node, context, converters) {
      //     return {
      //       type: context.entering ? "openTag" : "closeTag",
      //       tagName: "p",
      //       classNames: [`head`],
      //       attributes: { nodeid: "s" },
      //     };
      //   },
      // }}
      // plugins={[
      //   ()=>({wysiwygPlugins: [ plug ]})
      // ]}
      onLoad={(editr) => {
        console.log("onload", editr);
        // const editor = (ref.current as unknown as Editor).getInstance();
        // console.log({ editor });
        // editor.addCommand(
        //   "wysiwyg",
        //   "addId",
        //   (payload, state, dispatch, view) => {
        //     console.log("adding command 2");
        //     console.log(payload, state, dispatch, view);
        //     return true;
        //   }
        // );
      }}
      // widgetRules={[
      //   {
      //     rule: tagRe,
      //     toDOM: (text) => {
      //       const matched = text.match(tagRe);
      //       console.log({ text, matched });
      //       if (matched === null) {
      //         return document.createElement("span");
      //       }
      //       const span = document.createElement("span");
      //       const spanInner = document.createElement("span");
      //       spanInner.setAttribute("data-type", "tag");
      //       spanInner.appendChild(
      //         document.createTextNode(matched ? matched[2] : "")
      //       );
      //       if (matched[1] === " ")
      //         span.appendChild(document.createTextNode(" "));
      //       span.appendChild(spanInner);
      //       if (matched[3] === " ")
      //         span.appendChild(document.createTextNode(" "));
      //       return span;
      //     },
      //   },
      // ]}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }], idGen]}
      ref={ref}
      theme="dark"
      onFocus={() => {
        console.log("foc", ref);
        const state = (ref.current as any).editorInst.wwEditor.view
          .state as EditorState;
        const selection = TextSelection.create(
          state.doc,
          0,
          state.doc.content.size
        );
        // (ref.current as any).editorInst.mdEditor.view.dispatch(
        //   state.tr.insertText("som.......")
        // );

        // (ref.current as any).editorInst.mdEditor.view.dispatch(
        //   state.applyTransaction((transactions, prevState, nextState) => {
        //     const tr = nextState.tr;
        //     let modified = false;
        //     console.log("apply tr");
        //     if (transactions.some((transaction) => transaction.docChanged)) {
        //       // Adds a unique id to a node
        //       nextState.doc.descendants((node, pos) => {
        //         const { text } = nextState.schema.nodes;
        //         if (
        //           !isTargetNodeOfType(node, text) &&
        //           !isNodeHasAttribute(node, attrName)
        //         ) {
        //           const attrs = node.attrs;
        //           console.log("set id");
        //           tr.setNodeMarkup(pos, undefined, {
        //             ...attrs,
        //             [attrName]: nanoid(),
        //           });
        //           modified = true;
        //         }
        //       });
        //     }

        //     return modified ? tr : null;
        //   })
        // );
        const parser = DOMParser.fromSchema(
          (ref.current as any).editorInst.mdEditor.schema
        );
        const schema = (ref.current as any).editorInst.wwEditor
          .schema as Schema;
        // (ref.current as any).editorInst.commandManager.mdCommands.selectAll();
        console.log("adding command");
      }}
      onBeforeConvertWysiwygToMarkdown={(...args) => {
        console.log(args);
        // (ref.current as any).editorInst.mdEditor.view.state.create({
        //   doc: {
        //     type: "doc",
        //     content: [
        //       {
        //         type: "paragraph",
        //         content: [{ type: "text", text: "updated  text value" }],
        //       },
        //     ],
        //   },
        // });

        return args[0];
      }}
      onChange={(...args) => {
        console.log(
          (ref.current as any).editorInst.mdEditor.view.state.toJSON()
        );
        console.log(
          (ref.current as any).editorInst.wwEditor.view.state.toJSON()
        );
        // (ref.current as any).editorInst.commandManager.mdCommands.selectAll();
        // .setSelection(selection)
        // .replaceSelectionWith(
        //   parser.parse(
        //     new window.DOMParser().parseFromString(
        //       `<body><p>some other randommm</p></body>`,
        //       "text/html"
        //     ).body
        //   )
        // );

        // console.log((ref.current as any).editorInst.toastMark.getRootNode());
        // console.log(ref.current as any);
        return args[0];
      }}
    />
  );
};

export default MyComponent;

// function addIds(node: Record<string, any>){
//   if(node.attrs)
// }
