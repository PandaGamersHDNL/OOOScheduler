import { Outlet } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import { useContext, useEffect, useState } from "react";
import { MobileNav } from "./Navigation/MobileNav/MobileNav";
import { IsNewContext, ScreenSize, SizeContext } from "../main";
import { OnFirst } from "./Dashboard/OnFirst";

export default function Main() {
    const [screenSize, setScreenSize] = useState<ScreenSize>(getCurrentDimension());
    const isNewCtx = useContext(IsNewContext)
    function getCurrentDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile:  window.innerWidth < 815
        }
    }
    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);


        return (() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])
    return (
        <>
        <SizeContext.Provider value={screenSize}>
            {isNewCtx.isNew && <OnFirst setNew={isNewCtx.setIsNew!}/>}
            {screenSize.isMobile ?   <MobileNav />: <Navigation />}

            <Outlet />
        </SizeContext.Provider>
        </>
    )
}
