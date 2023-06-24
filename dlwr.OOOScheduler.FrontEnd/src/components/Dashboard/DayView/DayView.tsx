import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TEventData } from "../../../Models/EventData";
import { DayViewItem } from "./DayViewItem/DayViewItem";
import './DayView.sass'
import { UserContext } from "../../../main";
import { inDateRange } from "../Calendar/Calendar";
import { IconButton } from "@fluentui/react";
import { EditPanel } from "../../Edit/EditPanel";
import { DateTimeService } from "../../../services/DateTimeService";

export function DayView() {
    const events = useContext(UserContext)?.UserInfo.Events || []
    const params = useParams()
    const [selectedEvent, setSelectedEvent] = useState<TEventData>()
    const [openEdit, setOpenEdit] = useState<boolean>(false)

    const openEditor = (event: TEventData | undefined) => {
        setSelectedEvent(event);
        setOpenEdit(true);
    }

    const setOpen = (state: boolean) => {
        setOpenEdit(state);
    }
    var date: Date | undefined = undefined
    const year = params["year"]
    const month = params["month"]
    const day = params["day"]
    if (year && month && day) {
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    const newEvent = () => { openEditor(undefined) }

    if (!date) return <>no date found</>
    const filtered = events.filter(v => inDayRange(v, date!))
    const elementItems: JSX.Element[] = []
    if (events) {
        for (const item of filtered) {
            elementItems.push(<DayViewItem data={item} OpenEditor={openEditor} key={item.id} />)
        }
    }
    return (
        <>
            <div className="DayHeader">
                <span />
                <h2 style={{ width: "fit-content" }}>{DateTimeService.FormatDate(date)}
                </h2><IconButton className="ButtonStyle" onClick={newEvent}
                    iconProps={{ iconName: "Add" }} title="Add" />
            </div>
            <div className="DayViewItems">
                {elementItems}</div>
            {openEdit && <EditPanel Event={selectedEvent} open={openEdit} setOpen={setOpen} setData={setSelectedEvent} startDate={date} />}
        </>
    )

}

export function inDayRange(data: TEventData, day: Date) {
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    const inRange = inDateRange(data, start, end);

    return inRange
}

