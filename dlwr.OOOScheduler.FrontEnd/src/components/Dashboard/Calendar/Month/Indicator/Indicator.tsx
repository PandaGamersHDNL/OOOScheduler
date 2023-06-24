import { EEventType } from '../../../../../Models/EventData';
import './Indicator.sass'
export function Indicator(props: { amount: number, type: EEventType }) {
   if (props.amount == 0) return (<></>)
   return (<span className={"Dot " + props.type}  >{props.amount}</span>);
}
