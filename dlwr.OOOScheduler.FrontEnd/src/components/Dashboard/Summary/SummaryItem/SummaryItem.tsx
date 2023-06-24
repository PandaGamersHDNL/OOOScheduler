import { TEventData } from "../../../../Models/EventData";
import { DateTimeService } from "../../../../services/DateTimeService";

export function SummaryItem(props: { data: TEventData, openEditor: (event: TEventData) => void }) {
	if (!props.data.start?.dateTime || !props.data.end?.dateTime) return <></>
	const startDate = DateTimeService.FromGraphDateTime(props.data.start.dateTime)!
	const endDate = DateTimeService.FromGraphDateTime(props.data.end.dateTime)!
	let sameDate = false;
	if (startDate.getDate() == endDate.getDate()) {
		sameDate = true;
	}
	return (<div onClick={() => props.openEditor(props.data)} className="SumItem">
		<div className="SumDate">
			<b style={{ fontSize: 26, height: 28 }}>{DateTimeService.ToDate(startDate)}</b>
			<div>{DateTimeService.ToMonth(startDate)}</div>
		</div>
		<div>
			<div><b>{props.data.subject}</b></div>
			<div>{sameDate ? DateTimeService.ToTime(startDate) : DateTimeService.ToSlashDatetime(startDate)} - {sameDate ? DateTimeService.ToTime(endDate) : DateTimeService.ToSlashDatetime(endDate)}</div>
		</div>
	</div>);
}