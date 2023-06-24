import { useContext, useState } from 'react';
import { EditorState, Modifier, convertToRaw } from 'draft-js';
import { UserContext } from '../../../main';
import { GetPlaceholder } from '../../Edit/EditView';
import draftToHtmlPuri from "draftjs-to-html"


export function AddPlaceholderComp(
    props: {
        setMsg: (msg: string) => void
        onChange?: (...args: any[]) => any,
        editorState?: EditorState
    }) {
    const addPlaceholder = (placeholder: string) => {

        const contentState = Modifier.replaceText(
            props.editorState!.getCurrentContent(),
            props.editorState!.getSelection(),
            placeholder,
            props.editorState!.getCurrentInlineStyle(),
        );
        const newState = EditorState.push(props.editorState!, contentState, 'insert-characters');
        props.onChange!(newState);
        props.setMsg(draftToHtmlPuri(
            convertToRaw(newState.getCurrentContent())
        ));
    }
    const userCtx = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const openPlaceholderDropdown = () => setOpen(!open);

    const listItem = userCtx?.UserInfo.placeHolders.concat(userCtx.UserInfo.customPlaceholders!).map(item => (
        <li
            onClick={() => addPlaceholder(GetPlaceholder(item.name))}
            key={item.id}
            className="rdw-dropdownoption-default placeholder-li"
        >{item.name}</li>
    ))

    return <div onClick={openPlaceholderDropdown} className="rdw-block-wrapper" aria-label="rdw-block-control">
        <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-label="rdw-dropdown">
            <div className="rdw-dropdown-selectedtext" title="Placeholders">
                <span>Placeholder</span>
                <div className={`rdw-dropdown-caretto${open ? "close" : "open"}`}></div>
            </div>
            <ul className={`rdw-dropdown-optionwrapper ${open ? "" : "placeholder-ul"}`}>
                {listItem}
            </ul>
        </div>
    </div>
}

//export default AddPlaceholderComp;