import { BaseButton, DefaultButton, IContextualMenuProps, PrimaryButton } from "@fluentui/react";
import { EEventType, TEventData } from "../../Models/EventData";
import { DateTimeService } from "../../services/DateTimeService";
import { UserContext } from "../../main";
import { useContext } from "react";
import { DbUser } from "../../Models/DbUser";
import { ApiService } from "../../services/ApiService";

export function EditView(props: { data: TEventData | undefined, setEdit: (state: boolean, data?: TEventData) => void }) {
    const cntx = useContext(UserContext)
    const menuProps: IContextualMenuProps = {
        items: [
            {
                onClick: () => {
                    ApiService.GetEventId(props.data?.seriesMasterId!).then((data) => {
                        props.setEdit(true, data);
                    })
                },
                key: 'series',
                text: 'Edit event series',
                //iconProps: { iconName: 'Calendar' },
            },
        ],

    };
    if (!props.data) {
        props.setEdit(true);
        return <></>
    }
    //TODO display dependent on type
    const message = props.data[import.meta.env.VITE_MESSAGE_EXTENTION_ID];

    return (
        <>
            <h1>{props.data.subject}</h1>
            <h3><span className="Bold">Starts: </span>{DateTimeService.FormatGraphStringDefault(props.data.start?.dateTime!)}</h3>
            <h3><span className="Bold">Ends: </span>{DateTimeService.FormatGraphStringDefault(props.data.end?.dateTime!)}</h3>
            <DefaultButton split={props.data.type != EEventType.single} splitButtonMenuProps={{ className: "ButtonStyle", style: { color: "white" } }}
                menuProps={props.data.type != EEventType.single ? menuProps : undefined} className="ButtonStyle eep"
                onClick={() => props.setEdit(true)}>Edit
            </DefaultButton>
            <p hidden={!message} dangerouslySetInnerHTML={{ __html: "<span style='font-weight: 900;'>Message: </span>" + ReplacePlaceholders(message?.message!, cntx?.UserInfo!, props.data) }}></p>
        </>
    )
}

export enum EGlobalMessages {
    startTime = 1,
    endTime = 2
}

export function GetPlaceholder(name: string) {
    return `{${name}}`
}
// if no event, use current date and time
export function ReplacePlaceholders(msgStr: string, userInfo: DbUser, event?: TEventData) {
    const placeholders = userInfo.placeHolders!;
    for (const holder of placeholders.concat(userInfo.customPlaceholders!)) {
        const holderStr = GetPlaceholder(holder.name)
        let replaceTo: string;
        switch (holder.id) {
            case EGlobalMessages.startTime:
                replaceTo = event ? DateTimeService.FormatGraphStringDefault(event?.start?.dateTime!) : DateTimeService.FormatDateTime(new Date());
                break;
            case EGlobalMessages.endTime:
                replaceTo = event ? DateTimeService.FormatGraphStringDefault(event?.end?.dateTime!) : DateTimeService.FormatDateTime(new Date());
                break;
            default:
                replaceTo = holder.defaultValue;
        }

        msgStr = msgStr?.replaceAll(holderStr, `${replaceTo}`)!
    }
    return msgStr;
}