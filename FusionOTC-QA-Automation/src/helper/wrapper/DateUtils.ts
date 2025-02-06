import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

export default class DateUtil {
    constructor() { }
    async changeMonths(date: Date, months: number):Promise<Date> {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }

    async addDays(date: Date, days: number) :Promise<Date>{
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    async convertToSeconds(time: string): Promise<number> {
        const [minutes, seconds] = time.split(' ').filter((_, index) => index % 2 === 0).map(Number);
        return (minutes * 60) + seconds;
    }
    
}