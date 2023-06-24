import { useState } from "react"
import { Link } from "react-router-dom"
import { TEventData } from "../../../../Models/EventData"
import { DateTimeService } from "../../../../services/DateTimeService"
import { EditPanel } from "../../../Edit/EditPanel"

export function DayViewItem(props: { data: TEventData, OpenEditor: (event: TEventData) => void }) {
    const data = props.data

    return (
        <>
            <div onClick={() => props.OpenEditor(data)} className="DayItem">
                <h3><span className="Bold">Title: </span>{data.subject}</h3>
                <p><span className="Bold">Starts: </span>{DateTimeService.FormatGraphStringDefault(data.start?.dateTime!)}</p>
                <p><span className="Bold">Ends: </span>{DateTimeService.FormatGraphStringDefault(data.end?.dateTime!)}</p>
            </div>
        </>
    )
}