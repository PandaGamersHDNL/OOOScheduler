import { SubmitHandler, useForm } from "react-hook-form"
import { ApiService } from "../../services/ApiService"
import { Form } from "react-router-dom"
import { ControlledTextField } from "../ControlledFluent/ControlledTextField"
import { Checkbox, IconButton, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react"
import { UserContext } from "../../main"
import { useContext, useEffect, useState } from "react"
import { IMessages } from "../../Models/DbUser"
import { ContentState, EditorState, convertFromHTML } from "draft-js"
import { RTEditor } from "../ControlledFluent/RTEditor/RTEditor"
import { DeleteMessageDialog } from "./DeleteMessageDialog"

export function MessageEdit(props: {
    setAfter?: (id: number) => void,
    data: IMessages | undefined, setEdit: (state: boolean) => void,
    setData: React.Dispatch<React.SetStateAction<IMessages | undefined>>, setOpen: (state: boolean) => void
}) {
    const userCtx = useContext(UserContext);
    const [makeDefault, setMakeDefault] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [delEventSub, setDelEventSub] = useState<string>("");
    const [isDefaultEvent, setIsDefaultEvent] = useState(false);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

    const defaultForm = {
        userId: userCtx?.UserInfo?.id!
    } as IMessages
    const form = useForm<IMessages>({
        values: props.data,
        defaultValues: defaultForm
    })
    useEffect(() => {
        const msgObj = form.getValues();

        if (!msgObj || !msgObj.messageStr) {
            return
        }
        const htmlstr = convertFromHTML(msgObj.messageStr)
        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(htmlstr.contentBlocks)
        ))

    }, [])
    const delFunc = () => {
        setIsLoading(true);

        ApiService.DeleteMessage(props.data?.id!).then(id => {
            userCtx?.setUserInfo((e) => {
                const filtered = e.messages?.filter(i => i.id != props.data?.id!);
                return { ...e, messages: filtered }
            });
            props.setOpen(false);
            setIsLoading(false);
        })
    }

    const delMessagePrompt = () => {
        const id = props.data?.id!;
        const eventWid = userCtx?.UserInfo.Events?.filter(v => {
            const msgObj = v[import.meta.env.VITE_MESSAGE_EXTENTION_ID];
            return msgObj?.messageId == id.toString();
        })!

        setIsDefaultEvent(id == userCtx?.UserInfo.setting?.defaultMessageId && id != -1)

        let subj = "";
        for (const item of eventWid) {
            subj += item.subject + ", "
        }
        setDelEventSub(subj);
        setIsDialogVisible(true);

    }
    const onSubmit: SubmitHandler<IMessages> = data => {
        setIsLoading(true);
        if (!props.data || props.data.id == -1 || props.data.id == null) {
            ApiService.CreateMessage(data).then(v => {
                props.setData(v);
                props.setOpen(false);
                userCtx?.setUserInfo((e) => { e.messages?.push(v); return e });
                if (props.setAfter) {
                    props.setAfter(v?.id!)
                }
                ApiService.UpdateSettings({ ...userCtx?.UserInfo.setting!, defaultMessageId: v.id! }).then(()=> setIsLoading(false)) 
            });
        } else {
            ApiService.UpdateMessage(data).then(v => {
                props.setOpen(false);
                userCtx?.setUserInfo((v) => {
                    const changed = v.messages?.find(v => v.id == data.id)

                    if (changed) {
                        Object.assign(changed, data)
                    }
                    return v
                });
                if (props.setAfter) {
                    props.setAfter(v?.id!)
                }
                ApiService.UpdateSettings({ ...userCtx?.UserInfo.setting!, defaultMessageId: v.id! }).then((set)=> {userCtx?.setUserInfo({...userCtx.UserInfo, setting: {...userCtx.UserInfo.setting!, defaultMessageId: v.id!}});setIsLoading(false)})
            })
        }
    }



    return (
        <>
            <Form className="EditBox" onSubmit={form.handleSubmit(onSubmit)}>
                <ControlledTextField required label="Title" {...form.register("title")}
                    onChange={undefined} control={form.control} />
                <Checkbox label="Set default" defaultChecked={makeDefault}
                    onChange={(e, state) => {
                        setMakeDefault(state || false);
                    }} />
                <RTEditor setMsg={(msg) => form.setValue("messageStr", msg)} setEditorState={setEditorState} editorState={editorState} />
                {isLoading ? <Spinner size={SpinnerSize.medium} label="Sending request" /> :
                    <div className="MessageBox">
                        <PrimaryButton className="ButtonStyle " onClick={() => props.setOpen(false)}>Cancel</PrimaryButton>

                        <div style={{ display: "flex" }}>
                            <PrimaryButton className="ButtonStyle " type={"Submit"}>Save</PrimaryButton>
                            <span style={{ minWidth: 5 }} />
                            {!!props.data && <IconButton className="ButtonStyle" onClick={delMessagePrompt} iconProps={{ iconName: "Delete" }} />}
                        </div>
                    </div>}
            </Form>
            {isDialogVisible &&
                <DeleteMessageDialog
                    isDefault={isDefaultEvent} delFunc={delFunc}
                    setIsDialogVisible={setIsDialogVisible} events={delEventSub}
                />
            }
        </>
    );
}
