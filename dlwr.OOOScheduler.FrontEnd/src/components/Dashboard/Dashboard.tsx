import { Calendar } from "./Calendar/Calendar";
import { Summary } from "./Summary/Summary";
import { useContext, useState } from 'react';
import { TEventData } from "../../Models/EventData";
import { EditPanel } from "../Edit/EditPanel";
import { SizeContext, UserContext } from "../../main";
import './Dashboard.sass'
import { MobileCalendar } from "./MobileCalendar/MobileCalendar";
import { Overview } from "./Overview/Overview";
import { PrimaryButton } from "@fluentui/react";

export default function Dashboard() {
    const userCtx = useContext(UserContext);
    const sizeCtx = useContext(SizeContext);
    const [selectedEvent, setSelectedEvent] = useState<TEventData>();
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [isSum, setIsSum] = useState<boolean>(false);

    const openEditor = (event: TEventData | undefined) => {
        setSelectedEvent(event);
        setOpenEdit(true);
    };

    const setOpen = (state: boolean) => {
        setOpenEdit(state);
    };

    return (
        <>
            <div className={"Dashboard " + (sizeCtx?.isMobile? "MobileDashboard" : "")} >
                {sizeCtx?.isMobile && <PrimaryButton className="ButtonStyle" onClick={() => setIsSum((v) => !v)} > toggle </PrimaryButton>}
                {sizeCtx?.isMobile ? !isSum &&  <MobileCalendar /> : <Calendar data={userCtx?.UserInfo.Events!} openEdit={openEditor} />}
                {((!sizeCtx?.isMobile) || (isSum)) &&
                    <div style={sizeCtx?.isMobile ? undefined : { width: 20 + "%" }}>
                        <Overview />
                        <Summary data={userCtx?.UserInfo.Events!} openEditor={openEditor} />
                    </div>
                }
            </div>
            {openEdit && <EditPanel Event={selectedEvent} open={openEdit} setOpen={setOpen} setData={setSelectedEvent} />}
        </>
    )

}

