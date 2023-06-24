import { useContext } from "react";
import { UserContext } from "../../main";
import { Link } from "react-router-dom";
import { IconButton } from "@fluentui/react";

export function OnFirst(props: { setNew: (state: boolean) => void }) {
    const userCtx = useContext(UserContext)
    return (<><Link to={'./settings'} onClick={() =>props.setNew(false)}>
        Welcome to OOO Scheduler. The automatic reply system is currently disabled. click here to navigate to your settings. 
    </Link><IconButton iconProps={{ iconName: 'ChromeClose'}} onClick={()=> props.setNew(false)}/></>)
}