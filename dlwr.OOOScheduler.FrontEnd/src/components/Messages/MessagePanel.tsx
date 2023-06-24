
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useState, useCallback, SyntheticEvent } from "react"
import { MessageEdit } from './MessageEdit';
import { CloseDialog } from '../Dialog/CloseDialog';
import { IMessages } from '../../Models/DbUser';
import './MessagePanel.sass'

export function MessagePanel(props: {
    Message?: IMessages, open: boolean,
    setAfter?: (id: number) => void
    setOpen: (state: boolean) => void, setData: React.Dispatch<React.SetStateAction<IMessages | undefined>>
}) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEdit, setIsEdit] = useState<boolean>(false)
    //const openPanel = useCallback(() => setIsPanelOpen(true), []);
    const onDismiss = useCallback((ev?: SyntheticEvent | KeyboardEvent) => {
        if (ev) {
            // Instead of closing the panel immediately, cancel that action and show a dialog
            ev.preventDefault();
            setIsDialogVisible(true);
        }
    }, []);



    return (
        <div >
            <Panel
                type={PanelType.large}
                headerText={isEdit ? "Edit message" : "Your message"}
                isOpen={props.open}
                onDismiss={isEdit ? onDismiss : () => { props.setOpen(false); setIsEdit(false) }}
                closeButtonAriaLabel="Close"
                
            >
                <MessageEdit setAfter={props.setAfter} data={props.Message}
                    setData={props.setData} setEdit={setIsEdit} setOpen={props.setOpen} />
                    
                
            </Panel>
            {isDialogVisible && <CloseDialog setOpen={props.setOpen} setIsDialogVisible={setIsDialogVisible} />}
        </div>
    )
}
