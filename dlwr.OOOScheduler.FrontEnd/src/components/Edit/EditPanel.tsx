
import { DialogType } from '@fluentui/react/lib/Dialog';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useState, useCallback, SyntheticEvent, FormEvent, useEffect } from "react"
import { TEventData } from "../../Models/EventData"
import './EditPanel.sass'
import { EditView } from './EditView';
import { EditForm } from './EditForm';
import { CloseDialog } from '../Dialog/CloseDialog';

//TODO add recurrence option based on selected type
export function EditPanel(props: { startDate?: Date, Event?: TEventData, open: boolean, setOpen: (state: boolean) => void, setData: React.Dispatch<React.SetStateAction<TEventData | undefined>> }) {
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

    useEffect(()=> {
        console.log("pannel effect");
        
        setIsEdit(false)
    }, [])
    return (
        <div >
            <Panel
                type={PanelType.large}
                headerText={isEdit ? (props.Event ? "Edit" : "New") + " event" : "Your event"}
                isOpen={props.open}
                onDismiss={isEdit ? onDismiss : () => { props.setOpen(false); setIsEdit(false); console.log("edit false");
                }}
                closeButtonAriaLabel="Close"
            >
                {isEdit ? <EditForm startDate={props.startDate} data={props.Event!}
                    setEdit={setIsEdit} setData={props.setData} setOpen={props.setOpen} />
                    : <EditView setEdit={(state: boolean, data?: TEventData) => {setIsEdit(state); if(data) props.setData(data)} } data={props.Event!} />}
            </Panel>
            {isDialogVisible &&
                <CloseDialog setIsDialogVisible={setIsDialogVisible} setOpen={(state: boolean) => {props.setOpen(state); setIsEdit(state)}} />
            }


        </div>
    )
}

/**
 * all data + time data -> depends on type of event
 * if singular just start and end
 * if recurrent start time end time
 * start date 
 * type of recurrence 
 *  -> recurrence data
 *      day: every x days
 *      week: every x weeks + [week day (mon, tue ): number]
 *      month: x months
 *      year: x years
 * 
 * 
 */