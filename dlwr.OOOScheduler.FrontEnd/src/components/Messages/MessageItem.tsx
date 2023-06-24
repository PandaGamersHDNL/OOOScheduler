import { DbUser, IMessages } from "../../Models/DbUser";
import { ReplacePlaceholders } from "../Edit/EditView";

export function MessageItem(props: {Message: IMessages, onClick: () => void, user: DbUser}){
    return (
        <div onClick={props.onClick} className="DayItem"><h3>{props.Message.title}</h3>
        <div dangerouslySetInnerHTML={{__html: ReplacePlaceholders(props.Message.messageStr!, props.user)}} />
        </div>
    )
}