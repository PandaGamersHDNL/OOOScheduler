import { Event, NullableOption, Extension } from "@microsoft/microsoft-graph-types"



export type TEventData = IFixedEvent & {[prop in typeof name]: NullableOption<IEventMessage>}
export interface IFixedEvent extends Omit<Event, "type"> {
    type?: EEventType,
    
}

export 

const name = import.meta.env.VITE_MESSAGE_EXTENTION_ID;


export interface IEventMessage {
    messageId: NullableOption<string>,
    message: NullableOption<string>,
    messageType:NullableOption<EEventMessageType>
}

export enum EEventType {
    "occur" = "Occurrence",
    "excep" = "Exception",
    "serieMast" = "SeriesMaster",
    "single" = "SingleInstance"
}

export enum EEventMessageType {
    custom = "Custom",
    defined = "Defined"
}

export enum RecurrenceType {
    noRepeat = "norepeat",
    workDays = "Workdays",
    day = "daily",
    week = "weekly",
    monthAb = "absoluteMonthly",
}

export enum ERecurrenceType {
    noRepeat = "Don\'t repeat",
    workdays = "Workdays",
    daily = "Daily",
    weekly = "Weekly",
    absoluteMonthly = "Monthly",
}

export enum ERecurrenceName {
    noRepeat = "not needed",
    workdays = "weekly",
    daily = "day",
    weekly = "week",
    absoluteMonthly = "month"
}

