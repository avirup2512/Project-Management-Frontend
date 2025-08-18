import {Editor, EditorState, RichUtils} from 'draft-js';
import { useEffect, useRef, useState } from 'react';
import "./TextEditor.css";
import { Button, Container } from 'react-bootstrap';
import { ContentState } from "draft-js";
import { stateFromHTML } from 'draft-js-import-html';
import ReactQuill from 'react-quill-new';
import { File, FileUpIcon } from 'lucide-react';

function TextEditorComponent(props) {
  const [value, setValue] = useState('');
  const quillRef = useRef()
  useEffect(() => {    
    if (props.hasValue)
    {
      const commentText = stateFromHTML(props.value);
      setEditorState(EditorState.createWithContent(commentText));
    }
  },[props])
  const editorChange = (e) => {   
    setValue(e)
  }
  const modules = {
    toolbar: {
      container:"#customToolbar",
    }
  }
    const submit = () => {
    props.onSubmit(value);
    setValue('');
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Example: insert as text link
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    props.onFileUpload(file);
    quill.insertText(range.index, file.name, "link", URL.createObjectURL(file));
  };
  return (
    <div className='editor'>
      <input
        type='file'
        className='d-none'
        id="quill-file-input"
        onChange={handleFileChange}
      ></input>
      {/* Custom toolbar */}
      <div id="customToolbar">
        {/* Headers */}
        <select className="ql-header" defaultValue="">
          <option value="1"></option>
          <option value="2"></option>
          <option value=""></option>
        </select>

        {/* Text styles */}
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>

        {/* Lists */}
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>

        {/* Links & Images */}
        <button className="ql-link"></button>
        <button className="ql-image"></button>

        {/* File Upload */}
        <button type="button" onClick={() => document.getElementById("quill-file-input").click()}>
            <FileUpIcon size={16} style={{"color":"#000"}}/>
        </button>
      </div>

      <ReactQuill theme="snow"
        ref={quillRef}
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Write something here..."/>
      <Button onClick={submit}>Add Comment</Button>
    </div>
  );
}

export default TextEditorComponent;