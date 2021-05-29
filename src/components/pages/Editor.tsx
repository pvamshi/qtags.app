import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHistoryPlugin,
  createItalicPlugin,
  createListPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  getParent,
  getSlatePluginType,
  insertEmptyCodeBlock,
  isElement,
  isType,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  SlatePlugin,
  SlatePlugins,
  SPEditor,
  toggleList,
  unwrapList,
  useSlatePluginsStore,
  useStoreEditorValue,
  withNodeId,
} from "@udecode/slate-plugins";
import { elementContains } from "@uifabric/utilities";
import * as React from "react";
import { Transforms } from "slate";
import {} from "slate-react";
import { Transform } from "stream";

import {
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSoftBreakPlugin,
} from "./config/pluginOptions";

const editableProps = {
  placeholder: "Dump your brain, organize later...",
  style: {
    padding: "15px",
  },
};

// const withTask = (editor:SPEditor)=>{
//   const {insertText} = editor;
//   editor.insertText = (text: string)=>{

//   }
// }

let counter = 0;
const withGenerateId = (editor: SPEditor) => {
  const { insertNode } = editor;
  editor.insertNode = (node) => {
    console.log("insert node", node);
    insertNode(node);
  };
};
function createGenerateIdPlugin(): SlatePlugin {
  // const { insertNodes } = Transforms;
  // Transforms.insertNodes = (a, b, c) => {
  //   console.log({ b });
  //   insertNodes(a, b, c);
  // };
  return {
    renderElement: (editor) => (props) => {
      // if (props.element.type === ELEMENT_LIC) {
      //   return <span>- {props.children}</span>;
      // }

      // console.log(props.element.type);
      // if (props.element.type === ELEMENT_LIC) {
      //   return <span>- {props.children}</span>;
      // }
      // if (props.element.type === ELEMENT_LI) {
      //   console.log("list-item");
      //   return <span>{props.children} </span>;
      // }
      // if (props.element.type === ELEMENT_UL) {
      //   return <span>{props.children} </span>;
      //   // console.log({ props });
      //   // console.log("list");
      //   // return (
      //   //   <>
      //   //     <a>L</a>{" "}
      //   //     {props.children.map((child) => (
      //   //       <span>- {child}</span>
      //   //     ))}
      //   //   </>
      //   // );
      // }
      return undefined;
    },
    withOverrides: [
      (editor) => {
        const { insertBreak } = editor;

        // editor.insertText = (node) => {
        //   console.log(node);
        //   insertText(node);
        // };
        // editor.onChange = () => {
        //   console.log("changed", editor);
        //   onChange();
        // };
        // editor.insertNode = (node) => {
        //   console.log("insert node");
        //   insertNode(node);
        // };
        editor.insertBreak = () => {
          const path = editor.selection?.anchor.path;
          if (!path) insertBreak();

          console.log("insert break");
          insertBreak();
        };
        // editor.insertData = (data) => {
        //   console.log("insert data");
        //   insertData(data);
        // };
        // editor.insertFragment = (f) => {
        //   console.log("inesrt frag");
        //   insertFragment(f);
        // };
        // editor.normalizeNode = (t) => {
        //   console.log("norm");
        //   normalizeNode(t);
        // };
        return editor;
      },
      withNodeId({ idKey: "id" }),
    ],
  };
}

export const initialValueList = [
  {
    type: ELEMENT_H2,
    children: [{ text: "✍️ List" }],
  },
  { type: ELEMENT_LIC, children: [{ text: "" }] },
  {
    type: ELEMENT_UL,
    children: [
      {
        type: ELEMENT_LI,
        children: [
          {
            type: ELEMENT_LIC,
            children: [{ text: "Bulleted list" }],
          },
          {
            type: ELEMENT_UL,
            children: [
              {
                type: ELEMENT_LI,
                children: [
                  {
                    type: ELEMENT_LIC,
                    children: [{ text: "support" }],
                  },
                  {
                    type: ELEMENT_UL,
                    children: [
                      {
                        type: ELEMENT_LI,
                        children: [
                          {
                            type: ELEMENT_LIC,
                            children: [{ text: "a" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: ELEMENT_LI,
                children: [
                  {
                    type: ELEMENT_LIC,
                    children: [{ text: "nesting" }],
                  },
                  {
                    type: ELEMENT_UL,
                    children: [
                      {
                        type: ELEMENT_LI,
                        children: [
                          {
                            type: ELEMENT_LIC,
                            children: [{ text: "b" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: ELEMENT_LI,
        children: [
          {
            type: ELEMENT_LIC,
            children: [{ text: "c" }],
          },
        ],
      },
    ],
  },
  {
    type: ELEMENT_OL,
    children: [
      {
        type: ELEMENT_LI,
        children: [
          {
            type: ELEMENT_LIC,
            children: [{ text: "Numbered list" }],
          },
        ],
      },
    ],
  },
  {
    type: ELEMENT_PARAGRAPH,
    children: [
      {
        text: "With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!",
      },
    ],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: true,
    children: [{ text: "Slide to the left." }],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: true,
    children: [{ text: "Slide to the right." }],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: false,
    children: [{ text: "Criss-cross." }],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: true,
    children: [{ text: "Criss-cross!" }],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: false,
    children: [{ text: "Cha cha real smooth…" }],
  },
  {
    type: ELEMENT_TODO_LI,
    checked: false,
    children: [{ text: "Let's go to work!" }],
  },
  {
    type: ELEMENT_PARAGRAPH,
    children: [{ text: "Try it out for yourself!" }],
  },
];
const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();
const Editor = () => {
  // const ToolbarButtonsList = () => {
  //   const editor = useStoreEditorRef(useEventEditorId("focus"));

  //   return (
  //     <>
  //       <ToolbarList
  //         type={getSlatePluginType(editor, ELEMENT_UL)}
  //         icon={<FormatListBulleted />}
  //       />
  //       <ToolbarList
  //         type={getSlatePluginType(editor, ELEMENT_OL)}
  //         icon={<FormatListNumbered />}
  //       />
  //     </>
  //   );
  // };
  const pluginsBasic = [
    // editor
    createReactPlugin(), // withReact
    createHistoryPlugin(), // withHistory

    // elements
    createParagraphPlugin(), // paragraph element
    createBlockquotePlugin(), // blockquote element
    createCodeBlockPlugin(), // code block element
    createHeadingPlugin(), // heading elements

    // marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createCodePlugin(), // code mark
  ];
  const preFormat = (editor: SPEditor) => unwrapList(editor);

  const optionsAutoformat = {
    rules: [
      {
        type: ELEMENT_H1,
        markup: "#",
        preFormat,
      },
      {
        type: ELEMENT_H2,
        markup: "##",
        preFormat,
      },
      {
        type: ELEMENT_H3,
        markup: "###",
        preFormat,
      },
      {
        type: ELEMENT_H4,
        markup: "####",
        preFormat,
      },
      {
        type: ELEMENT_H5,
        markup: "#####",
        preFormat,
      },
      {
        type: ELEMENT_H6,
        markup: "######",
        preFormat,
      },
      {
        type: ELEMENT_LI,
        markup: ["*", "-"],
        preFormat,
        format: (editor: SPEditor) => {
          if (editor.selection) {
            const parentEntry = getParent(editor, editor.selection);
            if (!parentEntry) return;
            const [node] = parentEntry;
            if (
              isElement(node) &&
              !isType(editor, node, ELEMENT_CODE_BLOCK) &&
              !isType(editor, node, ELEMENT_CODE_LINE)
            ) {
              toggleList(editor, {
                type: ELEMENT_UL,
              });
            }
          }
        },
      },
      {
        type: ELEMENT_LI,
        markup: ["1.", "1)"],
        preFormat,
        format: (editor: SPEditor) => {
          if (editor.selection) {
            const parentEntry = getParent(editor, editor.selection);
            if (!parentEntry) return;
            const [node] = parentEntry;
            if (
              isElement(node) &&
              !isType(editor, node, ELEMENT_CODE_BLOCK) &&
              !isType(editor, node, ELEMENT_CODE_LINE)
            ) {
              toggleList(editor, {
                type: ELEMENT_OL,
              });
            }
          }
        },
      },
      {
        type: ELEMENT_TODO_LI,
        markup: ["[]"],
      },
      {
        type: ELEMENT_BLOCKQUOTE,
        markup: [">"],
        preFormat,
      },
      {
        type: MARK_BOLD,
        between: ["**", "**"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: MARK_BOLD,
        between: ["__", "__"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: MARK_ITALIC,
        between: ["*", "*"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: MARK_ITALIC,
        between: ["_", "_"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: MARK_CODE,
        between: ["`", "`"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: MARK_STRIKETHROUGH,
        between: ["~~", "~~"],
        mode: "inline",
        insertTrigger: true,
      },
      {
        type: ELEMENT_CODE_BLOCK,
        markup: "``",
        trigger: "`",
        triggerAtBlockStart: false,
        preFormat,
        format: (editor: SPEditor) => {
          insertEmptyCodeBlock(editor, {
            defaultType: getSlatePluginType(editor, ELEMENT_DEFAULT),
            insertNodesOptions: { select: true },
          });
        },
      },
    ],
  };

  const plugins = [
    ...pluginsBasic,
    createTodoListPlugin(),
    createListPlugin({}),
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createAutoformatPlugin(optionsAutoformat),
    createGenerateIdPlugin(),
  ];

  const data = useStoreEditorValue();
  // console.log(data);
  return (
    <>
      {/* <HeadingToolbar>
        <ToolbarButtonsList />
      </HeadingToolbar> */}
      <SlatePlugins
        id="list"
        plugins={plugins}
        components={components}
        options={options}
        editableProps={editableProps}
        // initialValue={initialValueList}
      />
    </>
  );
};
export default Editor;
