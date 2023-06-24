import { Label, IComboBox } from "@fluentui/react";
import { DateTime } from "luxon";
import { FormEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TEventData } from "../../../Models/EventData";
import { DateTimeService } from "../../../services/DateTimeService";
import { ControlledDatePicker } from "../../ControlledFluent/ControlledDatePicker";
import { ControlledTimePicker } from "../../ControlledFluent/ControlledTimePicker";

export function DateTimePicker(props: { notNameIsDirty: boolean,setIsDirty: (state: boolean) => void, isNew: boolean, name: "start" | "end", labelText: string, formControls: UseFormReturn<TEventData, any> }) {
    const data = props.formControls.watch()[props.name];

    const notName = props.name != "start" ? "start" : "end";
    const date = DateTimeService.FromGraphDateTime(data?.dateTime!);

    const onSelectDate = (input: any) => {
        console.log("select date" , props.formControls.formState.dirtyFields);
        const notState = props.formControls.getFieldState(`${notName}`, props.formControls.formState);
        
        input as Date
        date?.setFullYear(input?.getFullYear()!, input?.getMonth(), input?.getDate());
        //start > end
        console.log("seep", props.isNew , !notState.isTouched, notState);
        if ( (props.isNew && !props.notNameIsDirty) || (props.name == "start" ?
        date! > DateTimeService.FromGraphDateTime(props.formControls.getValues(notName)?.dateTime!)!
        : date! < DateTimeService.FromGraphDateTime(props.formControls.getValues(notName)?.dateTime!)!)
        ) {
            props.formControls.setValue!(`${notName}`, {...data,dateTime: DateTimeService.ToGraphString(date!)});
        }
        props.setIsDirty(true);
        const recurrence = props.formControls.getValues("recurrence")
        if(props.name == "start" && !!recurrence) {
            props.formControls.setValue!(`recurrence.range.startDate`, DateTimeService.ToGraphString(date!));
            props.formControls.setValue!(`recurrence.pattern.dayOfMonth`, date!.getDate());

        }
        //TODO to graph? 
        props.formControls.setValue!(`${props.name}`, {...data,dateTime: DateTimeService.ToGraphString(date!)});
    }

    const onChangeTime = (_event: FormEvent<IComboBox>, time: Date) => {
        date?.setHours(time.getHours(), time.getMinutes());
        props.formControls.setValue(`${props.name}.dateTime`, DateTimeService.ToGraphString(date!));
    }
    //validations
    const startBeforeEnd = () => {
        console.log("validate date time picker");

        const data = props.formControls.getValues();
        if (!data) return "No data";
        const start = DateTimeService.FromGraphDateTime(data.start?.dateTime!);
        const end = DateTimeService.FromGraphDateTime(data.end?.dateTime!);
        if (!start) return "No start date";
        if (!end) return "No end date";
        if (start.getTime() > end.getTime()) return "Start has to be before End";
        return true;
    }
    return (

        <div className="DatePickerFieldset" >

            <Label required={true}>{props.labelText}</Label>

            <div className="DateTimePicker" >
                <ControlledDatePicker 
                    {...props.formControls.register(`${props.name}`, { validate: startBeforeEnd })}
                    control={props.formControls.control}
                    id="datePicker" isRequired={true} className="DatePicker"
                    onSelectDate={onSelectDate} value={date} onChange={undefined}
                />
                <span style={{ minWidth: 5 }} />
                <ControlledTimePicker
                    {...props.formControls.register(`${props.name}.dateTime`)}
                    control={props.formControls.control}
                    required={true} className="TimePicker" increments={15}
                    styles={{ optionsContainer: { width: 70, userInput: undefined } }}
                    onChange={onChangeTime} defaultValue={date} />            </div>        </div>

    )
}

