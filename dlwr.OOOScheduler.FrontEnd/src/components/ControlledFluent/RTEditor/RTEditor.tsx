import {  Label } from "@fluentui/react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtmlPuri from "draftjs-to-html"
import {AddPlaceholderComp} from "./AddPlaceholder";


export function RTEditor(props: { children?: JSX.Element | JSX.Element[], setMsg: (msg: string) => void, editorState: EditorState, setEditorState: (state: EditorState) => void }) {
    const onEditorStateChange = (newState: EditorState) => {
        props.setEditorState(newState)
        props.setMsg(draftToHtmlPuri(
            convertToRaw(newState.getCurrentContent())
        ));
    }
    
    return (<div>
        <Label >Message</Label>
        <Editor

            toolbar={{
                options: ['inline', 'fontSize', 'blockType', 'list', 'textAlign', 'history'],
            }}
            editorState={props.editorState}
            wrapperClassName="RTEWrapper"
            toolbarClassName="RTEToolbar"
            editorClassName="RTEEditor"
            onEditorStateChange={onEditorStateChange}
            toolbarCustomButtons={[<AddPlaceholderComp setMsg={props.setMsg} />]}
        /><div className="RTEGroup">
            {props.children}
        </div>
    </div>)
}
