import { PublicClientApplication } from "@azure/msal-browser";
import { authentication } from "@microsoft/teams-js";
import * as MsalConfig from "../MsalConfig";
import { IsTeams } from "./AuthService";

export const msalInstance = new PublicClientApplication(MsalConfig.msalConfig);

export async function getToken() {
  const inst = msalInstance
  var token = "";
  //if (!inst.getAllAccounts()[0]) {
  //  inst.loginRedirect(MsalConfig.loginApiRequest);
  //}

  try {
    if (IsTeams()) {
      var authTokenRequest = {
        successCallback: function (result: string) { console.info("Success: " + result); },
        failureCallback: function (error: string) { console.error("Error getting token: " + error); }
      };
      token = await authentication.getAuthToken({ ...authTokenRequest, silent: true })
    } else {
      token = (await inst.acquireTokenSilent({
        scopes: MsalConfig.loginApiRequest.scopes,
        account: inst.getAllAccounts()[0]
      })).accessToken
    }
  } catch (error: any) {
    if (error.errorCode === "consent_required"
      || error.errorCode === "login_required"
      || error.errorCode === "user_login_error"
      || error.errorCode === "interaction_required"
    ) {
      // In case silent token request fails, invoke token by using an interactive method
      inst.acquireTokenRedirect(MsalConfig.loginApiRequest);
    }
  }

  return token;
  //is teams?
  //msteams.authentication.getAuthToken()
}

export function LogOut() {
  msalInstance.logoutRedirect()
}