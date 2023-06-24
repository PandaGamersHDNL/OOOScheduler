import { useContext, useState } from "react"
import { UserContext } from "../../../main"
import { PlaceholderItem } from "./PlaceholderItem";
import { IconButton, Label, TextField } from "@fluentui/react";
import { ApiService } from "../../../services/ApiService";
import { ICustomPlaceHolder } from "../../../Models/DbUser";
import { TooltipHostExt } from "../Settings";

export function Placeholders() {
    const userCtx = useContext(UserContext)
    const defaultHolder = { name: "", defaultValue: "", dbUserId: userCtx?.UserInfo.id! } as ICustomPlaceHolder
    const [newHolder, setNewHolder] = useState<ICustomPlaceHolder>(defaultHolder);

    const addPlaceholder = () => {
        ApiService.CreatePlaceholder(newHolder).then((n) =>
            userCtx?.setUserInfo((v) => {
                v.customPlaceholders?.push(n);
                return { ...v }
            }))
            setNewHolder(defaultHolder)
            
    }
    const items = []
    if (!userCtx?.UserInfo.placeHolders) return <></>
    for (const item of userCtx.UserInfo.placeHolders) {
        items.push(<PlaceholderItem data={item} key={item.id} />)
    }
    for (const item of userCtx?.UserInfo.customPlaceholders!) {

        items.push(<PlaceholderItem context={userCtx} data={item}  key={item.id} />)
    }

    return (
        <>
            <Label >Placeholders <TooltipHostExt content="Use {} and place the placeholder name inbetween. then the value will be placed there in the automatic reply message." /></Label>
            <table className="Placeholders">
                <thead>

                    <tr>
                        <th>Identifier</th><th>Default values</th><th style={{ maxWidth: 64}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                    <tr><td><TextField onChange={(e, n) => {
                        setNewHolder((v) => { v.name = n!; return v })
                    }} /></td>
                        <td><TextField multiline={true} onChange={(e, n) => { 
                            setNewHolder((v) => { console.log("new holder",v);
                             v.defaultValue = n!; return v }) }} /></td>
                        <td><IconButton className="IconButton" iconProps={{ iconName: "Add" }} onClick={addPlaceholder} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}