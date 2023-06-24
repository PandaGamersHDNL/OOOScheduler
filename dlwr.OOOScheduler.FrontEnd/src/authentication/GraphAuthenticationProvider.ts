import { AuthenticationProvider, AuthenticationProviderOptions } from "@microsoft/microsoft-graph-client";
import { msalInstance } from "../services/MsalService";

export class GraphAuthenticationProvider implements AuthenticationProvider{

   public constructor(private tokenCall:() => Promise<string>){}

    public getAccessToken = (authenticationProviderOptions?: AuthenticationProviderOptions | undefined):Promise<string> => {
        //console.log("auth provider token call");
        
        return this.tokenCall();
    }

}