import { Checkbox, DatePicker, Dropdown, IDropdownOption, Label, SpinButton } from "@fluentui/react";
import { DayOfWeek, PatternedRecurrence, RecurrencePatternType } from "@microsoft/microsoft-graph-types";
import { ChangeEvent, useState } from "react";
import { ERecurrenceName, ERecurrenceType, RecurrenceType, TEventData } from "../../../Models/EventData";
import '../EditPanel.sass'
import { DateTimeService } from "../../../services/DateTimeService";
import { UseFormReturn } from "react-hook-form";

export function RecurrenceEditor(props: { data: TEventData, formControls: UseFormReturn<TEventData, any> }) {
    //TODO set formdata state with parent function
    const [recurrence, setRecurrence] = useState<PatternedRecurrence>(props.data.recurrence!)

    const type = ERecurrenceName[props.data.recurrence?.pattern?.type as keyof typeof ERecurrenceName]
    const weekDayUpdate = (weekday: DayOfWeek, newState: boolean) => {
        console.log(weekday, props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "monday"));

        let daysOfWeek = props.data.recurrence?.pattern?.daysOfWeek;
        if (!daysOfWeek) {
            daysOfWeek = []
        }
        const weekdayIndex = daysOfWeek.findIndex((v) => v == weekday);
        if (weekdayIndex != -1)
            daysOfWeek.splice(weekdayIndex, 1)
        else
            daysOfWeek.push(weekday)
        props.formControls.setValue("recurrence.pattern.daysOfWeek", daysOfWeek)
    }
    //TODO use recurrence data
    return (
        <div className="SpecificEditor">
            <Label>Repeat</Label>
            
            {props.data.recurrence?.pattern?.type == "weekly" && <div className="Horizontal" style={{ paddingTop: 5, paddingBottom: 5 }}>
                <Checkbox label="Monday" className="DayName"
                    checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "monday")}
                    onChange={(ev, state) => weekDayUpdate("monday", state!)} />
                <Checkbox label="Tuesday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "tuesday")} onChange={(ev, state) => weekDayUpdate("tuesday", state!)} />
                <Checkbox label="Wednesday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "wednesday")} onChange={(ev, state) => weekDayUpdate("wednesday", state!)} />
                <Checkbox label="Thursday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "thursday")} onChange={(ev, state) => weekDayUpdate("thursday", state!)} />
                <Checkbox label="Friday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "friday")} onChange={(ev, state) => weekDayUpdate("friday", state!)} />
                <Checkbox label="Saturday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "saturday")} onChange={(ev, state) => weekDayUpdate("saturday", state!)} />
                <Checkbox label="Sunday" className="DayName" checked={!!props.data.recurrence?.pattern?.daysOfWeek?.find(v => v == "sunday")} onChange={(ev, state) => weekDayUpdate("sunday", state!)} />

            </div>}

            <div className="Every Horizontal">every <SpinButton className="SpinBtn"
                onChange={(e, v) => {
                    console.log("new v", props.formControls);

                    props.formControls.setValue("recurrence.pattern.interval", v ? parseInt(v) : undefined)
                }}
                value={props.data.recurrence?.pattern?.interval?.toString()} /> {type + (props.data.recurrence?.pattern?.interval! > 1 ? "s" : "")} </div>
            <div className="Horizontal">
                events occur every {props.data.recurrence?.pattern?.interval?.toString()}&nbsp;
                {type + (props.data.recurrence?.pattern?.interval! > 1 ? "s " : " ")}
                {
                    ERecurrenceType[props.data.recurrence?.pattern?.type as keyof typeof ERecurrenceType] == ERecurrenceType.weekly &&
                    ("on " + ArrayToString(props.data.recurrence?.pattern?.daysOfWeek!.sort((a, b) => sorter[a] - sorter[b])!))
                }
                {
                    ERecurrenceType[props.data.recurrence?.pattern?.type as keyof typeof ERecurrenceType] == ERecurrenceType.absoluteMonthly &&
                    ("on the " + props.data.recurrence?.pattern?.dayOfMonth + " th ")
                }
                untill&nbsp;<DatePicker style={{width: 150}} value={DateTimeService.FromGraphDateTime( props.data.recurrence?.range?.endDate)} onSelectDate={(date) => props.formControls.setValue("recurrence.range.endDate", DateTimeService.ToGraphString(date!))}/></div>
        </div>
    )
}

function ArrayToString(list: DayOfWeek[]) {
    let res = list[0];
    for(let i = 1; i < list.length; i++) {
        if(i < list.length-1) {
            res += ", "
        } else {
            res += " and "
        }
        res +=list[i]
    }
    res += " "
    return res;
}

const sorter = {
    // "sunday": 0, // << if sunday is first day of week
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
    "sunday": 7
  }
