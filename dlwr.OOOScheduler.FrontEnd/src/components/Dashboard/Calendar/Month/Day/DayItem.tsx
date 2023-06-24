import { EEventType, TEventData } from "../../../../../Models/EventData";
import { DateTimeService } from "../../../../../services/DateTimeService";

export function DayItem(props: {data: TEventData}){
    return (
        <p className={`DayItems ${GetEventType(props.data)}`}>{DateTimeService.FormatGraphStringTime(props.data.start?.dateTime!)} -{DateTimeService.FormatGraphStringTime(props.data.end?.dateTime!)}: {props.data.subject} </p>
    )
           

}

function GetEventType(data: TEventData){
    switch(data.type) {
        case (EEventType.serieMast):
        case (EEventType.occur):
            return EEventType.occur
        default:
            return EEventType.single
    }
}