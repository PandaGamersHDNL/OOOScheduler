import { UseFormRegister, UseFormReturn } from "react-hook-form";
import { ERecurrenceType, RecurrenceType, TEventData } from "../../../Models/EventData";
import { IHookFormProps } from "../../../Models/HookFormProps";
import { DateTimePicker } from "./DateTimePicker";
import { Dropdown, IDropdownOption, IDropdownProps, addMonths } from "@fluentui/react";
import { NullableOption, PatternedRecurrence } from "@microsoft/microsoft-graph-types";
import { DateTimeService } from "../../../services/DateTimeService";
import { useState } from "react";

export function SingleEditor(props: { isNew: boolean, formControls: UseFormReturn<TEventData, any>, data: TEventData }) {
    const [isDirtyStart, setIsDirtyStart] = useState(false)
    const [isDirtyEnd, setIsDirtyEnd] = useState(false)

    const data = props.formControls.watch()
    console.log("editor ", data.recurrence?.pattern?.type);
    const options: IDropdownOption[] = [];
    for (const ident in ERecurrenceType) {
        const key = ident as keyof typeof ERecurrenceType
        options.push({ key: key, text: ERecurrenceType[key] })
    }
    return (<>
        <DateTimePicker {...props} setIsDirty={setIsDirtyStart} notNameIsDirty={isDirtyEnd} isNew={props.isNew} name="start" labelText="Start"  />
        <div style={{ display: "flex",alignItems: "flex-end", padding: 0}}>
            <DateTimePicker {...props} setIsDirty={setIsDirtyEnd} notNameIsDirty={isDirtyStart} isNew={props.isNew} name="end" labelText="End" />
            <Dropdown style={{ paddingBottom: 10}}
                selectedKey={!data.recurrence?.pattern?.type ? "noRepeat" : data.recurrence?.pattern?.type}
                onChange={(e, key) => {
                    //console.log("day of month",DateTimeService.FromGraphDateTime(props.data.start?.dateTime!)?.getDate());
                    
                    let old: NullableOption<PatternedRecurrence> = {
                        pattern: {
                            interval: 1,
                            daysOfWeek: [],
                            firstDayOfWeek: "monday",
                            dayOfMonth: undefined
                        },
                        range: {
                            startDate: DateTimeService.ToGraphString(new Date()),
                            endDate: DateTimeService.ToGraphString(addMonths(new Date(), 3)),
                        }
                    };
                    const newType = key?.key as keyof typeof ERecurrenceType
                    const newKey = ERecurrenceType[newType]
                    if (newKey != ERecurrenceType.noRepeat ) {
                        const current = props.formControls.getValues("recurrence")
                        if (current && old) {
                            old = {
                                pattern: { ...old.pattern, ...current.pattern },
                                range: { ...old.range, ...current.range }
                            };
                        }

                        console.log("here", old);
                        if(newKey == ERecurrenceType.workdays) {
                            old.pattern!.type = "weekly"
                            old.pattern!.daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"]
                        }  
                        else if (newType != "noRepeat" && newType != "workdays"){
                            old.pattern!.type =  newType || undefined;
                        }
                        if (newKey == ERecurrenceType.absoluteMonthly) {
                            const dataStart = !!props.data ? props.data.start?.dateTime : undefined
                            console.log(dataStart);
                            
                            const start = DateTimeService.FromGraphDateTime(dataStart );
                            old.pattern!.dayOfMonth = start ? start.getDate() : new Date().getDate();
                        }
                    } else {
                        old = null;
                    }
                    console.log(old);

                    props.formControls.setValue("recurrence", old)
                }} dropdownWidth={100} options={options} />
        </div>
    </>);
}