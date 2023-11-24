import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { RouterProvider } from "react-router-dom";
import { IsTeams } from "../../services/AuthService";
import './App.sass'
import * as MsalConfig from "../../MsalConfig";
import { msalInstance } from "../../services/MsalService";
import { router } from "../../services/RouterService";
import { ErrorComponent } from "../ErrorComponent";
import { useEffect, useState } from "react";
import { ApiService } from "../../services/ApiService";
import { EventRangeContext, IsNewContext, SetLoadingCtx, UserContext } from "../../main";
import { DbUser } from "../../Models/DbUser";
import { Dialog, Spinner, SpinnerSize, addMonths, getMonthEnd } from "@fluentui/react";
export interface IEventRange {
	start: Date,
	end: Date
}
export default function App() {
	const [userInfo, setUserInfo] = useState<DbUser>({
		Events: [],
		placeHolders: [],
		customPlaceholders: [],
		messages: []
	})
	const [isNew, setIsNew] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [eventRange, setEventRange] = useState<IEventRange>({
		start: getMonthEnd(addMonths(new Date(), -1)),
		end: getMonthEnd(addMonths(new Date(), 1))
	})
	useEffect(() => {
		(async () => {
            console.log("handleRedirect start");
            
			const eep = await msalInstance.handleRedirectPromise()
				.catch((e) => {console.error("handleRedirect" , e);
                });
                console.log("handleRedirect res", eep);
                
			//TODO only do check user with events integrated
			setIsLoading(true);
			ApiService.getEventData(eventRange.start, eventRange.end).then(v => {
				ApiService.CheckUser().then(i => {
					setUserInfo((o) => { return { ...i.data, Events: v } as DbUser })
					if (i.code == 201) {
						setIsNew(true);
					}
					

				}).finally(()=> setIsLoading(false));
			});

		})();
	}, [])
	let Output;
	const RouterPvdr = (<RouterProvider router={router} />);
	if (IsTeams()) {
		Output = RouterPvdr;
	} else {
		Output = (
			<MsalProvider instance={msalInstance}>

				<MsalAuthenticationTemplate
					interactionType={InteractionType.Redirect}
					authenticationRequest={MsalConfig.loginApiRequest}
					errorComponent={ErrorComponent}
				>

					{RouterPvdr}

				</MsalAuthenticationTemplate>
			</MsalProvider>
		);
	}
	return (<>
		<IsNewContext.Provider value={{ isNew: isNew, setIsNew: setIsNew }} >
			<UserContext.Provider value={{ UserInfo: userInfo, setUserInfo: setUserInfo }}>
				<EventRangeContext.Provider value={{ eventRange: eventRange, setEventRange: setEventRange }}>
					<SetLoadingCtx.Provider value={setIsLoading}>

						{isLoading && <Dialog modalProps={{ isBlocking: true }}
							hidden={false}
							dialogContentProps={{ title: "App is loading data" }}>
							<Spinner size={SpinnerSize.medium} />
						</Dialog>}
						{Output}
					</SetLoadingCtx.Provider>
				</EventRangeContext.Provider>
			</UserContext.Provider>
		</IsNewContext.Provider>
	</>
	);
}


