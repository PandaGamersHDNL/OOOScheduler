import { Dropdown, IDropdownOption, IDropdownProps, IconButton, Label, PrimaryButton, Slider, TextField, Toggle, TooltipHost } from "@fluentui/react";
import { ApiService } from "../../services/ApiService";
import { useContext, useId, useState } from "react";
import { UserContext } from "../../main";
import { Placeholders } from "./Placeholders/Placeholders";
import './Settings.sass'
import { MessagePanel } from "../Messages/MessagePanel";
import { IMessages } from "../../Models/DbUser";
import { ReplacePlaceholders } from "../Edit/EditView";
import { CalendarLegend } from "../Dashboard/Calendar/CalendarLegend/CalendarLegend";

export default function Settings() {
    //use switch for on/off
    const [msg, setMsg] = useState<IMessages>();
    const [open, setOpen] = useState<boolean>(false);
    const onMessageChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined) =>{
        setNewDefault(option?.key as number)
    }
    const setNewDefault= (id: number) => {
        settings.defaultMessageId =id
                ApiService.UpdateSettings(settings).then((v) => {
                    userCtx?.setUserInfo((set) => { return { ...set, v } })
                })
    }
    const onRenderLabel = (props: IDropdownProps | undefined): JSX.Element => {
        return (
            <Label>{props?.label}<TooltipHostExt content="This message will be used when there is an event without message and set as the default message in the edit screen" /></Label>
        );
    };
    const userCtx = useContext(UserContext);
    if (!userCtx?.UserInfo.setting) return (<h2>currently no settings found</h2>)
    const settings = userCtx?.UserInfo.setting!
    const msgOptions: IDropdownOption[] =[];
    for (const msg of userCtx.UserInfo.messages!){
        msgOptions.push({key: msg.id!, text: msg.title!})
    }
    return (<>
    <div className="Settings">
        <h2>settings</h2>
        <Toggle label={<div>Enable OOO scheduler <TooltipHostExt content="Lets you decide if you want the auto reply to be scheduled. it does not disable last scheduled" /> </div>} className="ToggleButton"
            defaultChecked={settings.isEnabled}
            onChange={(e, c) => {
                settings.isEnabled = c || false;
                ApiService.UpdateSettings(settings).then((v) => {
                    userCtx?.setUserInfo((set) => { return { ...set, v } })
                })
                
            }} />
        <div style={{ width: "80%" }}> <Slider label="Threshold" defaultValue={settings.threshold} step={.25}
            max={4} onChange={(v, r) => {
                settings.threshold = (v)
                ApiService.UpdateSettings(settings).then((v) => {
                    userCtx?.setUserInfo((set) => { return { ...set, v } })
                })
            }} />
            automatic reply will activate when event is {settings.threshold} hour(s) or more</div>
        <div className="HorzFlex">
            <Dropdown defaultSelectedKey={settings.defaultMessageId} dropdownWidth={300} onChange={onMessageChange}
             onRenderLabel={onRenderLabel} label={"Default message"} options={msgOptions} />
            <span className="Spacer FlexSpacer" />
            <IconButton className="ButtonStyle" iconProps={{ iconName: "Add" }} onClick={() => {setMsg(undefined); setOpen(true)}} /></div>
            <div onClick={
                () => {
                    setMsg(
                        userCtx.UserInfo.messages?.find(v => v.id == userCtx.UserInfo.setting?.defaultMessageId));
                         setOpen(true);}}
                         dangerouslySetInnerHTML={{__html: ReplacePlaceholders(userCtx.UserInfo.messages?.find(v => v.id == userCtx.UserInfo.setting?.defaultMessageId)?.messageStr!, userCtx.UserInfo)}}
                         />
                   
        <Placeholders />
    </div>
    <MessagePanel setAfter={setNewDefault} open={open} setOpen={setOpen} setData={setMsg}  Message={msg} />
</>)
    //use dropdown and or nevigator to the edit message place
}

export function TooltipHostExt(props: { content: string, children?: JSX.Element[] | JSX.Element}) {
    const tooltipId = useId()
    const [showTooltip, setShowTooltip] = useState<boolean>(true)
    return (<TooltipHost content={props.content} id={tooltipId}
    tooltipProps={{onRenderContent: !!props.children ? () => (<>{props.children}</>) : undefined}}>
        
        <IconButton
            aria-label={'more info'}
            aria-describedby={showTooltip ? tooltipId : undefined}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => setShowTooltip(!showTooltip)}
            className="IconButton"
            iconProps={{ iconName: 'Info' }}
        />
    </TooltipHost>)
}