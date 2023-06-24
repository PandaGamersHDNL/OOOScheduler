import { TEventData } from "../../../../../Models/EventData";
import { DayItem } from "./DayItem";
import './Day.sass'

export function Day(props: {data: TEventData[]}){
    let items: JSX.Element[] = []
    for (const item of props.data) {
        items.push(<DayItem key={item.id} data={item} />)
    }
    return (
        <>
            {items}
        </>
    )
}