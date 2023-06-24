import { Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID, // Client ID 
    authority: "https://login.microsoftonline.com/" + import.meta.env.VITE_TENANT_ID, // Tenant ID of the React.JS App Registration
    redirectUri: import.meta.env.VITE_REDIRECT_URI

  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
  
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: string, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
} as Configuration;

// Can be found in the API Permissions of the ASP.NET Web API
export const loginApiRequest = {
  scopes: [import.meta.env.VITE_SCOPES, "Calendars.ReadWrite", "MailboxSettings.ReadWrite"] 
};