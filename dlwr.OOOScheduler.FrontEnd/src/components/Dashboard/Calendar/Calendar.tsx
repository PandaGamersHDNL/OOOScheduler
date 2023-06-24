import { addDays, addMonths, getMonthEnd, getMonthStart, IconButton, PrimaryButton } from "@fluentui/react";
import { Month, startOffsetDayofWeek } from "./Month/Month";
import "./Calendar.sass";
import { useContext, useEffect, useState } from "react";
import { TEventData } from "../../../Models/EventData";
import { DateTimeService } from "../../../services/DateTimeService";
import { DateTime } from "luxon";
import { CalendarLegend } from "./CalendarLegend/CalendarLegend";
import { TooltipHostExt } from "../../Settings/Settings";
import { EventRangeContext, SetLoadingCtx, UserContext } from "../../../main";
import { ApiService } from "../../../services/ApiService";

export function Calendar(props: { data: TEventData[], openEdit: (event: TEventData | undefined) => void }) {
    const [date, setDate] = useState<Date>(new Date());
    const newEvent = () => { props.openEdit(undefined) }
    const today = new Date();
    const eventCtx = useContext(EventRangeContext)!;
    const userCtx = useContext(UserContext)!;
    const setIsLoading = useContext(SetLoadingCtx)!;
    const isTodayMonth = date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth();
    useEffect(() => {
        const isPast = date.getTime() < eventCtx.eventRange.start.getTime();
        if (isPast ||
            date.getTime() > eventCtx.eventRange.end.getTime()
        ) {
            const process = (e: TEventData[]) => {
                setIsLoading(false);
                const newEventList: TEventData[] = [];
                for (const newEvent of e) {
                    if (!userCtx.UserInfo.Events?.find(v => v.id == newEvent.id)) {
                        newEventList.push(newEvent);
                    }
                }
                userCtx.setUserInfo(v => { v.Events = v.Events?.concat(newEventList); return v })
            }
            setIsLoading(true);
            if (isPast) {
                const newStart = addMonths(eventCtx!.eventRange.start, -1);
                ApiService.getEventData(newStart, eventCtx!.eventRange.start).then(process);
                eventCtx.setEventRange(v => { return { ...v, start: newStart } })
            } else {
                const newEnd = addMonths(eventCtx!.eventRange.end, 1);
                eventCtx.setEventRange(v => { return { ...v, end: newEnd } })
                ApiService.getEventData(eventCtx!.eventRange.end, newEnd).then(process);
            }
        }
    }, [date])
    return (
        <div className="CalendarWrapper">
            <div className="Calendar">
                <div className="CalendarHeader">
                    <div>
                        <h2>{DateTime.fromJSDate(date).toFormat("MMMM yyyy")}
                            {<TooltipHostExt content="Calendar legend" children={<CalendarLegend />}></TooltipHostExt>}
                        </h2>
                    </div>
                    <div className="CalendarButtons">
                        <div>
                            <IconButton style={{ marginRight: 5 }} className="ButtonStyle" onClick={() => setDate(addMonths(date, -1))} iconProps={{ iconName: "TriangleSolidLeft12" }} title="Previous" ariaLabel="Close" />

                            <IconButton className="ButtonStyle" onClick={() => setDate(addMonths(date, 1))} iconProps={{ iconName: "TriangleSolidRight12" }} title="Next" ariaLabel="Close" />
                        </div>
                        <IconButton className="ButtonStyle" onClick={newEvent}
                            iconProps={{ iconName: "Add" }} title="Add" />
                        <div><PrimaryButton className={"ButtonStyle " + (isTodayMonth ? "Today" : "")} onClick={() => setDate(new Date())}>Today</PrimaryButton></div>
                    </div>
                </div>
                <Month openEdit={props.openEdit}
                    date={date}
                    data={EventsForMonths(props.data, date)}
                    isTodayMonth={isTodayMonth} />
            </div>

        </div>
    );
}

export function EventsForMonths(data: TEventData[], monthDate: Date) {
    //TODO versitility with creation of events aka if month date is 25 / 04 -> before and after on what's showing up then check this for creating

    const forMonth: TEventData[] = []

    const start = getMonthStart(monthDate)
    //filter before
    //addDays(getMonthStart(monthDate) , -startOffsetDayofWeek(monthDate.getDay()))
    start.setHours(0, 0, 0)
    
    const end = getMonthEnd(monthDate)
    end.setHours(23, 59, 59)

    for (const dataItem of data) {
        if (inDateRange(dataItem, start, end))
            forMonth.push(dataItem)
    }
    
    return forMonth
}

export function inDateRange(data: TEventData, start: Date, end: Date) {


    if (!data.end?.dateTime || !data.start?.dateTime) return false
    if (DateTimeService.FromGraphDateTime(data.end.dateTime)!.getTime() < start.getTime()) {
        return false
    }

    if (DateTimeService.FromGraphDateTime(data.start.dateTime)!.getTime() > end.getTime()) {
        return false
    }
    return true
}
