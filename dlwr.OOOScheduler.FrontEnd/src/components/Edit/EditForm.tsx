import { Dropdown, IDropdownOption, IDropdownProps, IconButton, Label, PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { EventRangeContext, UserContext } from "../../main";
import { EEventMessageType, EEventType, TEventData, IEventMessage } from "../../Models/EventData";
import { ApiService } from "../../services/ApiService";
import { ControlledTextField } from "../ControlledFluent/ControlledTextField";
import { SingleEditor } from "./SingleEditor/SingleEditor";
import { TooltipHostExt } from "../Settings/Settings";
import { IMessages } from "../../Models/DbUser";
import { MessagePanel } from "../Messages/MessagePanel";
import { ContentState, EditorState, convertFromHTML } from "draft-js";
import { RTEditor } from "../ControlledFluent/RTEditor/RTEditor";
import { RecurrenceEditor } from "./RecurrenceEditor/RecurrenceEditor";

export function EditForm(props: { startDate?: Date, data: TEventData | undefined, setEdit: (state: boolean) => void, setData: React.Dispatch<React.SetStateAction<TEventData | undefined>>, setOpen: (state: boolean) => void }) {
    const [msgOpen, setMsgOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<IMessages>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const eventCtx = useContext(EventRangeContext)!;
    const updateEditor = (str: string) => {
        const htmlstr = convertFromHTML(str);
        setEditorState(EditorState.createWithContent(
            ContentState.createFromBlockArray(htmlstr.contentBlocks)
        ))
    }
    const defaultForm = {
        type: EEventType.single,
        showAs: "oof",
        start: {
            dateTime: props.data?.start?.dateTime || props.startDate?.toISOString() || new Date().toISOString(),
            timeZone: DateTime.fromJSDate(new Date()).zoneName
        },
        end: {
            dateTime: props.data?.end?.dateTime || props.startDate?.toISOString() || new Date().toISOString(),
            timeZone: DateTime.fromJSDate(new Date()).zoneName
        },
        [import.meta.env.VITE_MESSAGE_EXTENTION_ID]: { message: "", messageId: "-1", messageType: EEventMessageType.custom }
    } as TEventData
    const userCtx = useContext(UserContext)
    if (defaultForm[import.meta.env.VITE_MESSAGE_EXTENTION_ID]) {
        defaultForm[import.meta.env.VITE_MESSAGE_EXTENTION_ID] = {
            message: userCtx?.UserInfo.messages?.find(v => v.id == userCtx?.UserInfo.setting?.defaultMessageId)?.messageStr!,
            messageId: userCtx?.UserInfo.setting?.defaultMessageId.toString()!,
            messageType: EEventMessageType.defined
        }
    }

    const onRenderLabel = (props: IDropdownProps | undefined): JSX.Element => {
        return (
            <Label>{props?.label}<TooltipHostExt content="Select a message from the list you have already made." /></Label>
        );
    };
    const [key, setKey] = useState<number | string | undefined>(-1)
    const formControls = useForm<TEventData>({
        values: props.data, defaultValues: defaultForm
    });
    const setKeyFunc = (key: string | number | undefined, isChoice = false) => {
        let selectedMsg: IMessages;
        const oldState = formControls.getValues()[import.meta.env.VITE_MESSAGE_EXTENTION_ID];
        const custom = { id: -1, messageStr: (oldState?.message && !isChoice ? oldState.message : ""), title: "Custom message" }
        if (key == -1 || key == "-1") {
            selectedMsg = custom;
        } else {
            selectedMsg = userCtx?.UserInfo.messages?.find(v => v.id == key)!
            if (!selectedMsg) {
                selectedMsg = custom;
            }
        }
        formControls.setValue(import.meta.env.VITE_MESSAGE_EXTENTION_ID, {
            messageId: selectedMsg.id!.toString(),
            message: selectedMsg.messageStr!,
            messageType: selectedMsg.id == -1 ? EEventMessageType.custom : EEventMessageType.defined
        })
        updateEditor(selectedMsg.messageStr!);
        setKey(selectedMsg.id);
    }
    const onMessageChangeStr = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined) => {
        setKeyFunc(option?.key, true)
    }
    const onMessageChange = (newStr: string) => {
        setKey(-1);
        formControls.setValue(import.meta.env.VITE_MESSAGE_EXTENTION_ID, {
            messageId: "-1",
            message: newStr,
            messageType: EEventMessageType.custom
        })
    }

    const [isNew] = useState<boolean>(!props.data);

    useEffect(() => {
        const startId = formControls.getValues()[import.meta.env.VITE_MESSAGE_EXTENTION_ID]?.messageId;
        if (startId)
            setKeyFunc(startId!)
        else
            setKeyFunc(-1)
    }, [])
    const delEvent = () => {
        setIsLoading(true);

        if (props.data?.id) {
            ApiService.DeleteEvent(props.data?.id).then(id => {
                if(props.data?.type == EEventType.serieMast) {
                    userCtx?.setUserInfo((e) => {
                        const filtered = e.Events?.filter(i => i.seriesMasterId != id);
                        return { ...e, Events: filtered }
                    });
                } else {
                   userCtx?.setUserInfo((e) => {
                    const filtered = e.Events?.filter(i => i.id != id);
                    return { ...e, Events: filtered }
                }); 
                }
                
                setIsLoading(false);
                props.setOpen(false);
                props.setEdit(false);

            })
        } else {
            console.error("No id found");
        }
    }
    const onSubmit: SubmitHandler<TEventData> = data => {
        setIsLoading(true);
        if (isNew) {
            ApiService.CreateEvent(data).then(async v => {
                console.log("get instance", v, );
                if (v.type == EEventType.serieMast) {
                    
                    const instances = await ApiService.GetInstances(v.id!, eventCtx.eventRange.start, eventCtx.eventRange.end);
                    userCtx?.setUserInfo(usr => {return {...usr , Events: usr.Events?.concat(instances)}} )
                    props.setOpen(false)
                } else {
                    props.setData(v);
                    userCtx?.setUserInfo((e) => { e.Events?.push(v); return e });
                }
                props.setEdit(false);
            }).finally(() => {
                setIsLoading(false);
            });

        } else {
            ApiService.UpdateEvent(data).then(async v => {
                if (v.type == EEventType.serieMast) {
                    userCtx?.setUserInfo((e) => {
                        const filtered = e.Events?.filter(i => i.seriesMasterId != v.id);
                        return { ...e, Events: filtered }
                    });
                    const instances = await ApiService.GetInstances(v.id!, eventCtx.eventRange.start, eventCtx.eventRange.end);
                    userCtx?.setUserInfo(usr => {return {...usr , Events: usr.Events?.concat(instances)}} )
                    props.setEdit(false);
                    props.setOpen(false);
                } else {

                    userCtx?.setUserInfo((v) => {
                        const changed = v.Events?.find(v => v.id == data.id)
                        if (changed) {
                            Object.assign(changed, data)
                        }
                        return v
                    })
                }
                props.setEdit(false);
            }).finally(() => {
                setIsLoading(false);
            })
            
        }
    };
    const msgOptions: IDropdownOption[] = [{ key: -1, text: "Custom message" }];
    for (const msg of userCtx?.UserInfo.messages!) {
        msgOptions.push({ key: msg.id!, text: msg.title! })
    }

    return (
        <>
            <Form className="EditBox" onSubmit={formControls.handleSubmit(onSubmit)}>
                <ControlledTextField className="Label" id="title"
                    {...formControls.register("subject")}
                    label="Title" required={true}
                    control={formControls.control}
                    name={"subject"}
                    onChange={undefined}
                />
                <SingleEditor isNew={isNew} formControls={formControls} data={props.data!} />
                {formControls.watch("recurrence") && <RecurrenceEditor formControls={formControls} data={formControls.watch()} />}
                <RTEditor setMsg={onMessageChange} editorState={editorState} setEditorState={setEditorState} >
                    <div className="SelectMsg">

                        <Dropdown
                            dropdownWidth={150}
                            onRenderLabel={onRenderLabel} label={"Predefined message"}
                            options={msgOptions}
                            onChange={onMessageChangeStr}
                            defaultSelectedKey={key}
                        />

                    </div>
                    <a style={{ textDecoration: "underline" }} onClick={() => {
                        const formMsg = formControls.getValues()[import.meta.env.VITE_MESSAGE_EXTENTION_ID];
                        setMsgOpen(true);
                        setSelectedMessage({
                            messageStr: formMsg?.message!
                        });
                    }} >Save this message as a predefined message?</a>

                </RTEditor>
                {isLoading ? <Spinner size={SpinnerSize.medium} label="Sending request" /> :
                    <div className="MessageBox">
                        <PrimaryButton className="ButtonStyle " onClick={() =>{
                            props.setEdit(false); 
                            if (isNew) props.setOpen(false);
                            if(props.data?.recurrence != null) {
                                props.setOpen(false);
                            }
                            }}>Cancel</PrimaryButton>

                        <div style={{ display: "flex" }}>
                            <PrimaryButton className="ButtonStyle " type={"Submit"}>Save</PrimaryButton><span style={{ minWidth: 5 }} />
                            {!isNew && <IconButton className="ButtonStyle" onClick={delEvent} iconProps={{ iconName: "Delete" }} />}
                        </div>
                    </div>
                }

            </Form>
            <MessagePanel setAfter={setKeyFunc} open={msgOpen} setOpen={setMsgOpen}
                setData={setSelectedMessage} Message={selectedMessage} />
        </>
    ) //TODO                                                       add confirmation ^
}


