import {Editor, EditorState, RichUtils} from 'draft-js';
import { useEffect, useState } from 'react';
import "./TextEditor.css";
import { Button } from 'react-bootstrap';
import { ContentState } from "draft-js";
import { stateFromHTML } from 'draft-js-import-html';

function TextEditorComponent(props) {
  useEffect(() => {    
    if (props.hasValue)
    {
      const commentText = stateFromHTML(props.value);
      setEditorState(EditorState.createWithContent(commentText));
    }
  },[props])
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorChange = (e) => {    
      setEditorState(e);
  }
  const toggleBlockType = (blockType) => {
    editorChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }
  const toggleInlineStyle = (inlineStyle) => {
          editorChange(
            RichUtils.toggleInlineStyle(
              editorState,
              inlineStyle
            )
          );
  }
  const getBlockStyle = (block)=> {
        switch (block.getType()) {
          case 'blockquote': return 'RichEditor-blockquote';
          default: return null;
        }
      }
  const submit = () => {
    props.onSubmit(editorState);
  }
  return (
    <div className='editor'>
      <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
      <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
      />
      <hr></hr>
      <Editor editorState={editorState} onChange={editorChange} blockStyleFn={getBlockStyle}
                  placeholder="Add Comment."
                  spellCheck={true}/>
      <Button onClick={submit}>Add Comment</Button>
    </div>
  );
}
function BlockStyleControls(props)
{
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();
  const BLOCK_TYPES = [
        {label: 'H1', style: 'header-one'},
        {label: 'H2', style: 'header-two'},
        {label: 'H3', style: 'header-three'},
        {label: 'H4', style: 'header-four'},
        {label: 'H5', style: 'header-five'},
        {label: 'H6', style: 'header-six'},
        {label: 'Blockquote', style: 'blockquote'},
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'},
        {label: 'Code Block', style: 'code-block'},
  ];
  return (
    <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
              <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}
  </div>)
}
function StyleButton(props)
{
  const { label } = props;
  const onToggle = (e) => {
    e.preventDefault();
    props.onToggle(props.style);
  };
  return (
    <span className="RichEditor-styleButton" onMouseDown={onToggle}>
        {label}
    </span>
  )
}
function InlineStyleControls(props){
        const currentStyle = props.editorState.getCurrentInlineStyle();
        const INLINE_STYLES = [
        {label: 'Bold', style: 'BOLD'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'},
        {label: 'Monospace', style: 'CODE'},
      ];
        return (
          <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
              <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            )}
          </div>
        );
      };

export default TextEditorComponent;