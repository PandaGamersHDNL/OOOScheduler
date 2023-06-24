import { IconButton } from "@fluentui/react";
import { ApiService } from "../../../services/ApiService";
import { useState } from "react";
import { PlaceholderEdit } from "./PlaceholderEdit";
import { UserContext } from "../../../main";
import { ICustomPlaceHolder, IPlaceHolder, IUserContext } from "../../../Models/DbUser";

export function PlaceholderItem(props: { data: IPlaceHolder | ICustomPlaceHolder, context?: IUserContext }) {
    const isCustom = props.data as ICustomPlaceHolder | null;
    const DelPlace = () => {
        ApiService.DeletePlaceholder(props.data.id!).then(
            (res) => {
                props.context!.setUserInfo((v)=> {
                    const filtered = v.customPlaceholders?.filter((v)=> v.id !=props.data.id )
                    return {...v, customPlaceholders: filtered}
                })
            }
        )
    }
    const [isEdit, setIsEdit] = useState<Boolean>();
    if(props.context &&isEdit){
        return (<PlaceholderEdit data={isCustom!} setEdit={setIsEdit} context={props.context!} />)
    }
    return (
        <tr>
            <td>{props.data.name}</td>
            <td>{isCustom?.defaultValue || "you can't edit this value"}</td>
            <td className="Actions">
                <IconButton disabled={!isCustom?.dbUserId} className="IconButton" iconProps={{ iconName: "Edit" }} onClick={()=>  setIsEdit(true)} />
                <IconButton disabled={!isCustom?.dbUserId} className="IconButton" iconProps={{ iconName: "Delete" }} onClick={DelPlace}/>
            </td>
        </tr>
    )
}

