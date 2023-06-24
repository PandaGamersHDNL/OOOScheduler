import { DayOfWeek, FirstWeekOfYear, addDays, getMonthEnd, getMonthStart, getWeekNumber } from "@fluentui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { EEventType, TEventData } from "../../../../Models/EventData";
import "./Month.sass";
import { DateTimeService } from "../../../../services/DateTimeService";
import { SizeContext } from "../../../../main";

export function Month(props: { openEdit: (event: TEventData | undefined) => void, date: Date, data: TEventData[], isTodayMonth: boolean }) {
	const date = props.date;
	const events = props.data
	const tbodyRef = useRef<HTMLDivElement>(null)
	const sizeCtx = useContext(SizeContext);
	const [tbodyHeight, setTbodyHeight] = useState(350);
	useEffect(() => {
		const current = tbodyRef.current!;
		setTbodyHeight(current.clientHeight!);
	})
	useEffect(() => {
		const current = tbodyRef.current!;
		setTbodyHeight(current.clientHeight!);
	}, [sizeCtx])
	let movingDate = getMonthStart(date);
	movingDate = addDays(movingDate, -startOffsetDayofWeek(getMonthStart(date).getDay()))
	const days: JSX.Element[] = [];
	const weeksInMonth = getWeeksInMonth(date);

	for (let i = 0; i < weeksInMonth; i++) {
		for (let j = 0; j < 7; j++) {
			const item = (<div key={movingDate.getMonth() + "d" + movingDate.getDate()}
				className={"TableBodyItem " + (isToday(movingDate) ? "Today" : "")}
			style={{ height: (100 / weeksInMonth) + "%"}}>
				<Link style={{ height: "100%", width: "100%" }} to={"day/" + movingDate.getFullYear() + "/" + (movingDate.getMonth() + 1) + "/" + movingDate.getDate()}>
					<span>{movingDate.getDate()} </span><br />
				</Link></div>);
			days.push(item);
			movingDate = addDays(movingDate, 1);
		}
	}
	let eventRec: Record<number, { id: string, len: number, index?: number, isStartDay: boolean }[]> = {}
	for (const event of events) {
		const start = DateTimeService.FromGraphDateTime(event.start?.dateTime!)!
		const end = DateTimeService.FromGraphDateTime(event.end?.dateTime!)!

		movingDate = new Date(start);
		const eventLen = end.getDate() - start.getDate() + 1;
		for (let i = 0; i < eventLen; i++) {
			movingDate.setDate(start.getDate() + i)
			const id = movingDate.getMonth() * 100 + movingDate.getDate()
			if (!eventRec[id]) eventRec[id] = [];
			eventRec[id].push({ id: event.id!, len: eventLen, isStartDay: i == 0 })
		}
	}
	//TODO handle events passed month
	for (const list in eventRec) {
		const eventRecList = eventRec[list].sort((a, b) => b.len - a.len)
		for (let i = 1; i <= eventRecList.length; i++) {
			let itemId = Number.parseInt(list);

			if (!!eventRecList.find(v => v.index == i)) continue;
			const item = eventRecList.find(v => !v.index);
			if (!item) continue;
			item.index = i
			for (let j = 1; j < item.len; j++) {
				itemId++;
				const futureItem = eventRec[itemId].find(v => v.id == item.id)!;
				futureItem.index = i
			}
		}
	}

	const eventElements: JSX.Element[] = []
	for (const dayId in eventRec) {
		for (const item of eventRec[dayId]) {
			if (!item.isStartDay) continue;
			const event = events.find(v => v.id == item.id)
			if (!event) continue;
			let eventLen = item.len;
			const start = DateTimeService.FromGraphDateTime(event.start?.dateTime!)
			const end = DateTimeService.FromGraphDateTime(event.end?.dateTime!)
			const startOffset = startOffsetDayofWeek(start?.getDay()!);
			const endOffset = startOffsetDayofWeek(end?.getDay()!);
			let i = 0;
			const isMulti = 7 - startOffset < item.len

			while (eventLen > 0) {

				let left = (startOffset / 7) * 100;
				let right = ((6 - endOffset) / 7) * 100;
				if (isMulti) {
					if (i == 0) {
						right = 0;
						eventLen -= (7 - startOffset);
					} else if (eventLen >= 7) {
						left = 0
						right = 0
						eventLen -= 7
					} else {
						left = 0
						eventLen = 0
					}
				} else {
					eventLen -= (eventLen);
				}

				const offset = item.index!;
				const topVal = (((getWeekOffset(start!) + i) / weeksInMonth) * tbodyHeight) + (28 * offset) - 4;

				eventElements.push(<div key={event.id + "day" + dayId + i} className={event.type == EEventType.single ? "SingleInstance" : "Occurrence"}
					onClick={() => props.openEdit(event)}
					style={{
						height: 24,
						overflow: "hidden",
						paddingLeft: 5,
						top: topVal,
						margin: 2, position: "absolute", left: left + "%", right: right + "%"
					}} >{DateTimeService.FormatGraphStringTime(event.start?.dateTime!)} {event.subject} </div>);
				i++;
			}
		}
	}
	const head = []
	const start = addDays(props.date, -startOffsetDayofWeek(props.date.getDay()));
	for (let i = 0; i < 7; i++) {
		head.push(<div key={"head" + i} className="MonthHeaderItem">{DateTimeService.ToDayofWeek(addDays(start, i))}</div>)
	}
	return (
		<>
			<div className="Month">
				<div className="MonthHeader">
					{head}
				</div>

				<div ref={tbodyRef} className="TableBody"
					onResize={(e) => {
						//setTbodyHeight(e.currentTarget.clientHeight);
					}}>
					{days}
					{eventElements}
				</div>
			</div>
		</>
	);
}

function getWeeksInMonth(date: Date) {
	const startWeek = getWeekNumber(getMonthStart(date), DayOfWeek.Monday, FirstWeekOfYear.FirstDay);
	const lastWeek = getWeekNumber(getMonthEnd(date), DayOfWeek.Monday, FirstWeekOfYear.FirstDay);

	return lastWeek - startWeek + 1; //last week (6)
}

function getWeekOffset(date: Date) {
	const startWeek = getWeekNumber(getMonthStart(date), DayOfWeek.Monday, FirstWeekOfYear.FirstDay);
	const targetWeek = getWeekNumber(date, DayOfWeek.Monday, FirstWeekOfYear.FirstDay);

	return targetWeek - startWeek;
}

export function startOffsetDayofWeek(dayofweek: DayOfWeek | undefined) {
	switch (dayofweek) {
		case DayOfWeek.Monday:
			return 0;
		case DayOfWeek.Tuesday:
			return 1;
		case DayOfWeek.Wednesday:
			return 2;
		case DayOfWeek.Thursday:
			return 3;
		case DayOfWeek.Friday:
			return 4;
		case DayOfWeek.Saturday:
			return 5;
		case DayOfWeek.Sunday:
			return 6;
		default:
			return 0;
	}
}

export function isToday(date: Date) {
	const now = new Date()

	return date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
}


