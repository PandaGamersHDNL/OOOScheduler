import { Dispatch, SetStateAction } from "react"
import { TEventData } from "./EventData"

export interface DbUser {
    id?: string,
    setting?: DbSettings,
    messages?: IMessages[],
    Events?: TEventData[],
    customPlaceholders?: ICustomPlaceHolder[],
    placeHolders: IPlaceHolder[]
}

export interface DbSettings {
    id: number,
    userId: string,
    isEnabled: boolean,
    threshold: number,
    defaultMessageId: number
}

export interface IMessages {
    id?: number
    title?: string
    messageStr?: string
    userId?: string
}

export interface IPlaceHolder {
    id?: number,
    name: string,
    defaultValue: string
}

export interface ICustomPlaceHolder extends IPlaceHolder {
    dbUserId: string,
}

export interface IUserContext {
    UserInfo: DbUser,
    setUserInfo: Dispatch<SetStateAction<DbUser>>
}

