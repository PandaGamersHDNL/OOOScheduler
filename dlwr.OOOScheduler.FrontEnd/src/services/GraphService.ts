import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials"
import { InteractiveBrowserCredential } from "@azure/identity"
import { AuthenticationHandler, BatchRequestContent, BatchRequestStep, Client, Context, HTTPMessageHandler, Middleware } from "@microsoft/microsoft-graph-client";
import { IGraphUser, IProfile, IReturnBatch } from "../Models/GraphUser";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../MsalConfig";
import { GraphAuthenticationProvider } from "../authentication/GraphAuthenticationProvider";
import { IGraphService } from "../contracts/IGraphService";


export class GraphService implements IGraphService {
    private graphClient: Client;

    constructor(tokenCall: () => Promise<string>) {
        this.graphClient = Client.initWithMiddleware({
            authProvider: new GraphAuthenticationProvider(tokenCall)
        });
    }

    public getUserProfile(): Promise<IProfile> {

        const batchRequestContent = new BatchRequestContent([
            {
                id: "1",
                request: new Request("/me", {
                    method: "GET"
                })
            } as BatchRequestStep,
            {
                id: "2",
                request: new Request("/me/photo/$value", {
                    method: "GET"
                }),

            }
        ]);

        return batchRequestContent.getContent().then((content) => {
            return this.graphClient.api('/$batch').post(content)
                .then((res: { responses: IReturnBatch[] }) => {

                    const v = res.responses;
                    const user = v.find((v) => v.id == "1")?.body as IGraphUser
                    const imgData = v.find((v) => v.id == "2")?.body as string
                    const profile: IProfile = {
                        imgUrl: "data:image/jpeg;base64," + imgData,
                        ...user
                    }
                    //console.log(profile);

                    return profile
                })
        })

    }
}

export async function GetUserProfileAndImg() {
    const batchRequestContent = new BatchRequestContent([
        {
            id: "1",
            request: new Request("/me", {
                method: "GET"
            })
        } as BatchRequestStep,
        {
            id: "2",
            request: new Request("/me/photo/$value", {
                method: "GET"
            }),

        }
    ]);
} 