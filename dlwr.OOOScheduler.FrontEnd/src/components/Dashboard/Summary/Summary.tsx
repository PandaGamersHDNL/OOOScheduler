import { TEventData } from "../../../Models/EventData";
import { DateTimeService } from "../../../services/DateTimeService";
import { SummaryItem } from "./SummaryItem/SummaryItem";

export function Summary(props: { data: TEventData[], openEditor: (event: TEventData) => void }) {
	const items: JSX.Element[] = [];
	const sorted = props.data.sort((a, b) => {
		if (a.start?.dateTime && b.start?.dateTime)
			return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
		return 0
	})

	const filtered = sorted.filter(v=>DateTimeService.FromGraphDateTime(v.start?.dateTime!)?.getTime()! > new Date().getTime() )
	if (filtered.length == 0) return <div><h2>No events coming up</h2></div>
	for (const item of filtered) {
		items.push(<SummaryItem data={item} openEditor={props.openEditor} key={item.id} />);
		if(items.length >= 5) break;
	}
	return (<div className="Summary"><div className="SumHead" >upcoming events</div>
		{items}
	</div>);
}