import axios from "axios";
import { msalInstance } from "./MsalService";
import { authentication } from "@microsoft/teams-js";
import * as MsalConfig from "../MsalConfig";
import { AccountInfo, SilentRequest } from "@azure/msal-browser";
export function IsTeams(): boolean {
  return (getClientType() == ClientType.TeamsBrowser) || (getClientType() == ClientType.TeamsDesktopApp)
}

export const getClientType = (): ClientType => {
  const userAgent: string = window.navigator.userAgent.toLocaleLowerCase();

  if (userAgent.indexOf("sharepoint for") > -1) {
    return ClientType.SharePointMobileApp;
  } else if (
    userAgent.indexOf("teams") > -1 &&
    userAgent.indexOf("electron") > -1 &&
    window.location !== window.parent.location
  ) {
    return ClientType.TeamsDesktopApp;
  } else if (
    userAgent.indexOf("teams") > -1 &&
    userAgent.indexOf("electron") > -1
  ) {
    return ClientType.TeamsDesktopTab;
  } else if (userAgent.indexOf("teamsmobile-android") > -1) {
    return ClientType.TeamsAndroidApp;
  } else if (userAgent.indexOf("teamsmobile-ios") > -1) {
    return ClientType.TeamsIosApp;
  } else if (window.location !== window.parent.location) {
    return ClientType.TeamsBrowser;
  } else {
    return ClientType.Browser;
  }
};

export class AuthService {
  static getOBOToken(bearer: string) {

    return axios.get("/acquireobotoken?resource=https%3A%2F%2Fgraph.microsoft.com",
      { headers: { Authorization: "bearer " + bearer }, baseURL: import.meta.env.VITE_API_URI }).then(v => {
        return v.data as string
      })
  }
}
export enum ClientType {
  Browser,
  TeamsAndroidApp,
  TeamsBrowser,
  TeamsDesktopApp,
  TeamsDesktopTab,
  TeamsIosApp,
  SharePointMobileApp,
}

export const getSSOToken = (forApi: boolean): Promise<string> => {
	const isTeams = IsTeams();
	if (isTeams) {
		//console.debug()

		return authentication.getAuthToken().then((v) => { 

			return forApi ? v : AuthService.getOBOToken(v)
		}).catch((v) => {

			return v;
		}); // gets auth token for api -> request new token with the right scope -> use that token to call the batch
	} else {
		const scopes = forApi ? MsalConfig.loginApiRequest.scopes : ["User.Read"];
        
		return handleAuth(scopes);
	}
};

const handleAuth = async (scopes: string[]): Promise<string> => {
	let token = "";
	if (!msalInstance.getActiveAccount()) {
        const allAccounts = msalInstance.getAllAccounts();
		if (!allAccounts || allAccounts.length <= 0) {

		}
		else {
			msalInstance.setActiveAccount(allAccounts[0]);
		}
	}

    //account: msalInstance.getActiveAccount() as AccountInfo
	const redirectRequestParams = { scopes: scopes, redirectUri:  import.meta.env.VITE_REDIRECT_URI} as SilentRequest;

	try {
		token = (await msalInstance.acquireTokenSilent(redirectRequestParams)).accessToken;
	}
	catch (error) {
        console.log("threw error on acquire silent");
        
		// error toevoegen
		msalInstance.acquireTokenRedirect(redirectRequestParams)
			.catch(v => console.error("could not get token from redirect, login failed", v));
	}
	return token;
};

