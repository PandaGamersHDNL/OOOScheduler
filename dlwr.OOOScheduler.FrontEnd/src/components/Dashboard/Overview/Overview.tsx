import { Label } from "@fluentui/react";
import { useContext } from "react";
import { UserContext } from "../../../main";
import { EventsForMonths } from "../Calendar/Calendar";
import { inDayRange } from "../DayView/DayView";
import './Overview.sass'

export function Overview() {
    const userCtx = useContext(UserContext);
    const thisMonth = EventsForMonths(userCtx?.UserInfo.Events!, new Date())
    const eventsToday = userCtx?.UserInfo.Events?.filter(v => inDayRange(v, new Date()))
    return (<div className="Overview">
        <div className="OverviewItem">
            <Label >Events this month </Label>
            <span>{thisMonth.length}</span>
        </div><div className="OverviewItem">
            <Label >Events today </Label>
            <span>{eventsToday?.length}
            </span>
        </div></div>)
}