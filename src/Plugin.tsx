import "tippy.js/dist/tippy.css";
import "./index.css";
import ReactDOM from "react-dom";
import React, { useMemo } from "react";
import {
  ELEMENT_IMAGE,
  ELEMENT_PARAGRAPH,
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  HeadingToolbar,
  MentionSelect,
  SlatePlugin,
  SlatePlugins,
  ToolbarSearchHighlight,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createHistoryPlugin,
  createKbdPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  createDeserializeHTMLPlugin,
  useFindReplacePlugin,
  useMentionPlugin,
  withProps,
  MentionElement,
  ELEMENT_MENTION,
  SPEditor,
} from "@udecode/slate-plugins";
// import {
//   createExcalidrawPlugin,
//   ELEMENT_EXCALIDRAW,
//   ExcalidrawElement,
// } from "@udecode/slate-plugins-excalidraw";
import { optionsAutoformat } from "./config/autoformatRules";
// import { initialValuePlayground } from "./config/initialValues_old";
import {
  editableProps,
  optionsExitBreakPlugin,
  optionsMentionPlugin,
  optionsResetBlockTypePlugin,
  optionsSoftBreakPlugin,
} from "./config/pluginOptions";
import { renderMentionLabel } from "./config/renderMentionLabel";
import { BallonToolbarMarks, ToolbarButtons } from "./config/Toolbars";
import { withStyledPlaceHolders } from "./config/withStyledPlaceholder";
import { withStyledDraggables } from "./config/withStyledDraggables";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

type TEditor = SPEditor & ReactEditor & HistoryEditor;

let components = createSlatePluginsComponents({
  [ELEMENT_MENTION]: withProps(MentionElement, {
    renderLabel: renderMentionLabel,
  }),
  //   [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
  // customize your components by plugin key
});
components = withStyledPlaceHolders(components);
components = withStyledDraggables(components);

const options = createSlatePluginsOptions({
  // customize your options by plugin key
});

const Plugins = () => {
  const { setSearch, plugin: searchHighlightPlugin } = useFindReplacePlugin();
  const { getMentionSelectProps, plugin: mentionPlugin } =
    useMentionPlugin(optionsMentionPlugin);

  const plugins: SlatePlugin<TEditor>[] = useMemo(() => {
    const p = [
      createReactPlugin(),
      createHistoryPlugin(),
      createParagraphPlugin(),
      createBlockquotePlugin(),
      createTodoListPlugin(),
      createHeadingPlugin(),
      createImagePlugin(),
      createLinkPlugin(),
      createListPlugin(),
      createTablePlugin(),
      createMediaEmbedPlugin(),
      createCodeBlockPlugin(),
      //       createExcalidrawPlugin(),
      createAlignPlugin(),
      createBoldPlugin(),
      createCodePlugin(),
      createItalicPlugin(),
      createHighlightPlugin(),
      createUnderlinePlugin(),
      createStrikethroughPlugin(),
      createSubscriptPlugin(),
      createSuperscriptPlugin(),
      createKbdPlugin(),
      createNodeIdPlugin(),
      createAutoformatPlugin(optionsAutoformat),
      createResetNodePlugin(optionsResetBlockTypePlugin),
      createSoftBreakPlugin(optionsSoftBreakPlugin),
      createExitBreakPlugin(optionsExitBreakPlugin),
      createTrailingBlockPlugin({
        type: ELEMENT_PARAGRAPH,
      }),
      createSelectOnBackspacePlugin({
        allow: [ELEMENT_IMAGE],
      }),
      mentionPlugin,
      searchHighlightPlugin,
    ];

    p.push(createDeserializeHTMLPlugin({ plugins: p }));

    return p;
  }, [mentionPlugin, searchHighlightPlugin]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SlatePlugins
        id={"main"}
        plugins={plugins}
        components={components}
        options={options}
        editableProps={editableProps}
      >
        {/* <ToolbarSearchHighlight icon={Search} setSearch={setSearch} /> */}
        <div className="sticky top-0 z-10 bg-white">
          <HeadingToolbar>
            <ToolbarButtons />
          </HeadingToolbar>
        </div>

        <BallonToolbarMarks />

        <MentionSelect
          {...getMentionSelectProps()}
          renderLabel={renderMentionLabel}
        />
      </SlatePlugins>
    </DndProvider>
  );
};

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Plugins />, rootElement);

export default Plugins;
