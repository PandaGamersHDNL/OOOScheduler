import { IconButton, TextField, TooltipHost } from "@fluentui/react";
import { ApiService } from "../../../services/ApiService";
import { UserContext } from "../../../main";
import { useId, useState } from "react";
import { ICustomPlaceHolder, IUserContext } from "../../../Models/DbUser";

export function PlaceholderEdit(props: { data: ICustomPlaceHolder, setEdit: (state:boolean)=>void, context: IUserContext }) {
    const [holder, setHolder] = useState<ICustomPlaceHolder>(props.data)

    const save = () =>{
        ApiService.UpdatePlaceholder(holder).then(v => {
            props.context.setUserInfo((o => {
                //const updated = o.customPlaceholders?.find
                const index = o.customPlaceholders?.findIndex((i)=> i.id ==holder.id);
                
                if(index == undefined) return {...o}
                o.customPlaceholders![index] = v;
                
                return { ...o, customPlaceholders: o.customPlaceholders };
            }));
            props.setEdit(false);
        })
    }
    return (
        <tr><td><TextField defaultValue={props.data.name} onChange={(e,v) => setHolder((o)=> {return {...o, name: v!}})}/></td>
            <td><TextField multiline={true}
             defaultValue={props.data.defaultValue} onChange={(e,v) => setHolder((o)=> {return {...o, defaultValue: v!}})}/></td>
            <td><IconButton className="IconButton" iconProps={{ iconName: "Save" }} onClick={save}/>
                <IconButton className="IconButton" iconProps={{ iconName: "Cancel" }} onClick={()=> props.setEdit(false)} />
            </td>
        </tr>
    )
}

