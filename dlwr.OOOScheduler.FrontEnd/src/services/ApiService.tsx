import axios from 'axios'
//import { IApiService } from "../contracts/IApiService";
import { TEventData } from "../Models/EventData";
import { DbSettings, DbUser, ICustomPlaceHolder, IMessages } from "../Models/DbUser";
import { DateTimeService } from './DateTimeService';
import { NullableOption, RecurrencePattern } from '@microsoft/microsoft-graph-types';

export class ApiService {
    /*static getEventDataDate(date: Date): Promise<TEventData[]> {

        return axios.get(`/graph/events/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`).then((v) => {

            const data: TEventData[] = v.data;
            return v.data;
        })

    }*/
    static getEventData(start: Date, end: Date): Promise<TEventData[]> {
        return axios.get(`/graph/events/${DateTimeService.ToGraphString(start)}/${DateTimeService.ToGraphString(end)}`).then((v) => {
            const data: TEventData[] = v.data;
            return data;
        }).catch(v => []);
    }
    static GetEventId(id: string) {
        return axios.get(`/graph/events/${id}`)
            .then(v => {
                v.data.recurrence.pattern.type = v.data.recurrence?.pattern?.type!.toLowerCase()
                if (!!v.data.recurrence.pattern.daysOfWeek)
                    v.data.recurrence.pattern.daysOfWeek = v.data.recurrence.pattern.daysOfWeek.map((v: string) => v.toLowerCase());
                return v.data as TEventData
            });
    }

    static UpdateEvent(event: TEventData) {
        return axios.patch(`/graph/events`, event)
            .then(v => v.data as TEventData);
    }

    static CreateEvent(event: Omit<TEventData, "id">) {
        return axios.post(`/graph/events`, event)
            .then(v => v.data as TEventData);
    }

    static DeleteEvent(id: string) {
        return axios.delete(`/graph/events/${id}`)
            .then(v => id);
    }

    static CheckUser() {
        return axios.get(`/user/check`)
            .then(v => {
                return { data: v.data as DbUser, code: v.status };
            });
    }

    static UpdateSettings(item: DbSettings) {
        return axios.patch(`/user/settings`, item)
            .then(v => v.data as DbSettings)
    }

    static CreatePlaceholder(newHolder: ICustomPlaceHolder) {
        return axios.post('/user/placeholder', newHolder)
            .then((v) => v.data as ICustomPlaceHolder)
    }

    static async DeletePlaceholder(id: number) {
        axios.delete(`/user/placeholder/${id}`);
    }

    static async UpdatePlaceholder(newHolder: ICustomPlaceHolder) {
        return axios.patch('/user/placeholder', newHolder).then((v) => v.data as ICustomPlaceHolder)
    }

    static CreateMessage(newMessage: IMessages) {
        return axios.post('/user/message', newMessage)
            .then((v) => v.data as IMessages)
    }

    static async DeleteMessage(id: number) {
        axios.delete(`/user/message/${id}`);
    }

    static async UpdateMessage(newMessage: IMessages) {
        return axios.patch('/user/message', newMessage).then((v) => v.data as IMessages)
    }

    static async GetInstances(id: string, start: Date, end: Date) {
        return axios.get(`graph/events/${id}/instances/${DateTimeService.ToGraphString(start)}/${DateTimeService.ToGraphString(end)}`).then((v) => v.data as TEventData[])
    }

}

