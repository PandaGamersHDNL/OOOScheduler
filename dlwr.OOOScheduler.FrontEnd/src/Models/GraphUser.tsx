export interface IGraphUser {
    "@odata.context": string,
    businessPhones: string[],
    displayName: string,
    givenName: string,
    id: string,
    jobTitle: string | undefined,
    mail: string,
    mobilePhone: string | null,
    officeLocation: string | null,
    preferredLanguage: string | null,
    surname: string,
    userPrincipalName: string
}


export interface IReturnBatch {
    id: string,
    headers: { "Content-Type": string },
    status: number,
    body: string | IGraphUser | Blob
}

export interface IProfile extends IGraphUser {
    imgUrl: string
}

