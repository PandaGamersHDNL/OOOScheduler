import { PrimaryButton } from "@fluentui/react";
import { IMessages } from "../../Models/DbUser";

export function MessageView(props: { data: IMessages | undefined, setEdit: (state: boolean) => void }) {
    return <>
    <PrimaryButton className="ButtonStyle" onClick={() => props.setEdit(true)} > Edit </PrimaryButton>
    </>
}