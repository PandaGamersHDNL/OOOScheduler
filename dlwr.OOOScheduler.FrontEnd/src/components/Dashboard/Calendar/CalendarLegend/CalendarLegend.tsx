import { EEventType } from "../../../../Models/EventData";
import './CalendarLegend.sass'
export function CalendarLegend() {
    return (
        <div className="Legend" style={{ width: 350 }}>
            <div><p>Single event: <span className={"Dot " + EEventType.single} style={{ float: "right", width: "auto", minWidth: 24 }}>&nbsp;</span></p></div>
            <div><p>Recurrent event: <span className={"Dot " + EEventType.occur} style={{ float: "right", width: "auto", minWidth: 24 }}>&nbsp;</span></p></div>
        </div>
    )
}