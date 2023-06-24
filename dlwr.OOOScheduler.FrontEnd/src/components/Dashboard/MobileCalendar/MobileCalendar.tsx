import { IconButton, PrimaryButton, addDays } from "@fluentui/react"
import { DateTime } from "luxon"
import { useContext, useEffect, useRef, useState } from "react"
import { startOffsetDayofWeek } from "../Calendar/Month/Month";
import './MobileCalendar.sass'
import { SizeContext, UserContext } from "../../../main";
import { DateTimeService } from "../../../services/DateTimeService";
import { inDayRange } from "../DayView/DayView";
import { EditPanel } from "../../Edit/EditPanel";
import { EEventType, TEventData } from "../../../Models/EventData";

export function MobileCalendar() {
    const [open, setOpen] = useState(false);
    const [selectedE, setSelectedE] = useState<TEventData>();
    const openEdit = (item?: TEventData) => {
        setSelectedE(item);
        setOpen(true);
    }
    const height = 50;
    const [date, setDate] = useState<Date>(new Date());
    const sizeCtx = useContext(SizeContext);
    const userCtx = useContext(UserContext);
    const today = new Date();
    //TODO is today needed?
    const isTodayMonth = date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth();
    const weekDays: JSX.Element[] = [];
    const offset = startOffsetDayofWeek(date.getDay());
    const movingDate = addDays(date, -offset);
    for (let index = 0; index < 7; index++) {
        const local = addDays(movingDate, index)
        const isSelected = local.getDate() == date.getDate()
        weekDays.push(<p onClick={() => setDate(local)} className={"WeekdaysItem " + (isSelected ? "Selected" : "")}>{local.getDate()}</p>)

    }
    const events: JSX.Element[] = [];
    const filtered = userCtx?.UserInfo.Events?.filter(v => inDayRange(v, date)) || [];
    const padding = 5;
    const width = (sizeCtx?.width! - height - (2 * padding)) - 50 / filtered.length
    let horzOfset = 0;
    for (const item of filtered) {
        const start = DateTimeService.FromGraphDateTime(item.start?.dateTime!)
        const min = start?.getMinutes()!
        const hour = start?.getHours()!, minOff = (min / 60) * height
        const end = DateTimeService.FromGraphDateTime(item.end?.dateTime!)
        let heightOff = 1;
        const startTime = start?.getHours()! + (start?.getMinutes()! / 60);
        const endTime = end?.getHours()! + (end?.getMinutes()! / 60);
        let topVal = hour * (height + .8) + minOff;
        if (start?.getDate() == end?.getDate()) {
            heightOff = endTime - startTime;
        } else if (start?.getDate() == date.getDate()) {
            heightOff = 24 - startTime;
        } else if (end?.getDate() == date.getDate()) {
            heightOff = endTime;
            topVal = 0;
        } else {
            heightOff = 24;
            topVal = 0;
        }
        const isSingle = item.type == EEventType.single
        console.log(item.type, isSingle);

        events.push(<div className={"EventMob " + (isSingle ? "SingleInstance" : "Occurrence")} onClick={() => openEdit(item)} style={{
            top: topVal,
            left: height + width * horzOfset, height: height * heightOff, width: width
        }}>{item.subject}</div>)

        horzOfset++;
    }
    const hours: JSX.Element[] = []
    for (let i = 0; i < 24; i++) {
        hours.push(<div style={{ height: height, borderBottom: "1px dotted black" }}>{i}:00</div>)
    }
    const CalBox = useRef<HTMLDivElement>(null);
    useEffect(() => {
        CalBox.current!.scrollTop = CalBox.current?.scrollHeight! / 3;
    })
    return (
        <div style={{
            flexGrow: 1, padding: 5, width: "100%", display: "flex", flexDirection: "column"
        }}>
            <div >
                <h2>{DateTime.fromJSDate(date).toFormat("MMMM yyyy")}</h2><div className="CalendarButtons">
                    <div>
                        <IconButton className="ButtonStyle" onClick={() => setDate(v => addDays(v, -1))} iconProps={{ iconName: "TriangleSolidLeft12" }} title="Previous" ariaLabel="Close" />
                        <IconButton className="ButtonStyle" onClick={() => setDate(v => addDays(v, 1))} iconProps={{ iconName: "TriangleSolidRight12" }} title="Next" ariaLabel="Close" />
                    </div>
                    <IconButton className="ButtonStyle" onClick={() => {
                        openEdit(undefined)
                    }}
                        iconProps={{ iconName: "Add" }} title="Add" />
                    <div><PrimaryButton className={"ButtonStyle " + (isTodayMonth ? "Today" : "")} onClick={() => setDate(new Date())}>Today</PrimaryButton></div>
                </div></div>
            <div className="Weekdays">{weekDays}</div>
            <div className="DayMob" ref={CalBox}>
                <div className="Allday"></div>
                {hours}
                {events}
            </div>
            {open && <EditPanel startDate={date} open={open} setOpen={setOpen} setData={setSelectedE} Event={selectedE} />}
        </div >)
}