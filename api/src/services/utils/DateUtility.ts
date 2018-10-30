type DateOffset = { days?: number, minutes?: number };

export default class DateUtility {
    static getInstance(): DateUtility {
        return new DateUtility();
    }

    currentDate(): Date {
        return new Date();
    }

    currentDateString(): string {
        return this.currentDate().toUTCString();
    }

    currentDateOffset(offset: DateOffset): Date {
        return this.applyDateOffset(this.currentDate(), offset);
    }

    applyDateOffset(date: Date, offset: DateOffset): Date {
        let result = new Date(date);
        if (offset.days) {
            result.setDate(result.getDate() + offset.days); 
        }
        if (offset.minutes) {
            result.setUTCMinutes(result.getUTCMinutes() + offset.minutes);
        }
        return result;
    }

    currentDateOffsetString(offset: DateOffset): string {
        return this.currentDateOffset(offset).toUTCString();
    }

    parseDateString(date: string): Date {
        return new Date(date);
    }
}