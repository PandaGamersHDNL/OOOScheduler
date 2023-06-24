import { DateTime } from "luxon";

export class DateTimeService {
    static appDefault = "MMM dd yyyy',' HH:mm"
    static longDate = "MMM dd yyyy"
    static inputDateTime = "yyyy-MM-dd'T'HH:mm"
    static graphFormat = "yyyy-MM-dd'T'HH:mm" //iso
    static timeFormat = "HH:mm"
    static dateFormat = "yyyy-MM-dd"

    //TODO check if datetime timezone == utc
    static FromGraphDateTime(datetimeStr: string | null | undefined) {
        try {
            if(!datetimeStr) return
            const dateObj = DateTimeService.FromUtcStringToUserZone(datetimeStr).toJSDate()
            return dateObj
        } catch (e) {
            console.error("zone conversion failed: ", e);

        }

    }

    static FormatGraphStringTime(datetimeStr: string){
        const dateObj = DateTimeService.FromUtcStringToUserZone(datetimeStr)
        return dateObj.toFormat(DateTimeService.timeFormat)

    }
    static FormatGraphStringDefault(datetimeStr: string) {
        
        const dateObj = DateTimeService.FromUtcStringToUserZone(datetimeStr)
        return dateObj.toFormat(DateTimeService.appDefault)
    }

    static FormatDate(date: Date){
        const dateTime = DateTime.fromJSDate(date);
        return dateTime.toFormat(DateTimeService.longDate )
    }

    static FormatDateTime(date: Date){
        const dateTime = DateTime.fromJSDate(date);
        return dateTime.toFormat(DateTimeService.appDefault )
    }

    static FormatGraphStringToInput(str: string) {
        const dateObj = DateTimeService.FromUtcStringToUserZone(str)
        return dateObj.toFormat(this.inputDateTime)
    }
    static FromUtcStringToUserZone(datetimeStr: string){
        return DateTime.fromISO(datetimeStr, {zone: "UTC"}).setZone(DateTime.now().zone)
    }

    static ToSlashDatetime(date: Date) {
        return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy HH:mm");
        
    }
    static ToMonth(date: Date) {
        return DateTime.fromJSDate(date).toFormat("MMM");
    }
    static ToDate(date: Date) {
        return DateTime.fromJSDate(date).toFormat("dd");
    }

    static ToTime(date: Date) {
        return DateTime.fromJSDate(date).toFormat(this.timeFormat);
    }

    static ToDayofWeek(date: Date) {
        return DateTime.fromJSDate(date).toFormat("cccc");
    }

    static ToGraphString(date: Date) {
        return date.toISOString();
    }
} 