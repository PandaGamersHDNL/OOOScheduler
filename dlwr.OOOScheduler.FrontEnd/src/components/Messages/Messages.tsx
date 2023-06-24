import { useContext, useState } from "react"
import { UserContext } from "../../main"
import { MessageItem } from "./MessageItem";
import { MessagePanel } from "./MessagePanel";
import { IMessages } from "../../Models/DbUser";
import { IconButton } from "@fluentui/react";

export function Messages() {
    const ctx = useContext(UserContext)
    const [selectedMessage, setSelectedMessage] = useState<IMessages>()
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const msgs = ctx?.UserInfo.messages
    let jsx = [];
    
    for (const msg of msgs!) {
        const onClick = () =>{ setSelectedMessage(msg); setOpenEdit(true)}
        jsx.push(<MessageItem key={msg.id} Message={msg} onClick={onClick} user={ctx?.UserInfo!}/>)
    }
    return (
        <div className="Messages">
            <div className="DayHeader"><div className="SumHead">Messages</div> <IconButton className="ButtonStyle" onClick={() => {setOpenEdit(true); setSelectedMessage(undefined)}} iconProps={{iconName: "Add"}}/> </div>
            <div className="DayViewItems">
            {jsx}

            </div>
            <MessagePanel setData={setSelectedMessage} open={openEdit} setOpen={setOpenEdit} Message={selectedMessage} />
        </div>
    )
}