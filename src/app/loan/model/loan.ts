import { loadTranslations } from "@angular/localize";
import { LoanService } from "../loan.service";
import { OnInit } from "@angular/core";
import { User } from "src/app/user/model/user";
import { Game } from "src/app/game/model/game";

export class Loan{
    id!:number;
    userId!:number;
    gameId!:number;
    startDate!:Date;
    endDate!: Date;
    startDateText:string = this.stringify(this.startDate);
    endDateText: string = this.stringify(this.endDate);
    startDateMillis!:number;
    endDateMillis!: number;
    userName!: string;
    gameName!: string;
    user!: User;
    game!: Game;


    distributeAttributes() {
        this.gameId = this.game.id;
        this.gameName = this.game.title;
        this.userId = this.user.id;
        this.userName = this.user.name;
    }



    getDates() {
        this.startDate = new Date(this.startDateMillis);
        this.endDate = new Date(this.endDateMillis);
    }

    stringify(date:Date): string {
        if(date != null && date != undefined) {
        let date2 = date.toString();
        let dmy = date2.split("T")[0];
        let toReverse = dmy.split("-");
        dmy = toReverse[2]+"/"+toReverse[1]+"/"+toReverse[0];
        return dmy.replaceAll("-", "/");
        } else {
            return "";
        }
    }

    static stringify(date:Date): string {
        if(date != null && date != undefined) {
        let date2 = date.toString();
        let dmy = date2.split("T")[0];
        let toReverse = dmy.split("-");
        dmy = toReverse[2]+"/"+toReverse[1]+"/"+toReverse[0];
        return dmy.replaceAll("-", "/");
        } else {
            return "";
        }
    }

    static stringifySafe(date:Date): string {
        //alert(date);
        if(date != null && date != undefined) {
        let disect = date.toString().split(" ");
        let day = disect[2];
        let year = disect[3];
        let month = disect[1].replace('Jan', '01').replace('Feb', '02').replace('Mar', '03').replace('Apr', '04').replace('May', '05').replace('Jun', '06').replace('Jul', '07').replace('Aug', '08').replace('Sep', '09').replace('Oct', '10').replace('Nov', '11').replace('Dec', '12');
        let dmy = day+'/'+month+'/'+year;

        return dmy;
        } else {
            return "";
        }
    }

    static toDate(date: string, swapped:boolean) {// Swapped means if the day and month are swapped (like in anglosaxon countries)
        let split = (String(date)).split("/");
        let day;
        let month;
        let year = split[2];
        if(split.length === 3 && split[0].length === 2 && split[1].length === 2 && split[3].length === 4) {
            if(swapped) {
                day = split[1];
                month = split[0];
            } else {
                day = split[0];
                month = split[1];
            }
            
            

            let dms = (Number(day)+1) * 24 * 3600 * 1000;
            let mms = (Number(month)) * this.getDaysInMonth(Number(month), Number(year))* 24 * 3600 * 1000;
            let yms = Math.round((Number(year)-1970) * 365.25 * 24 * 3600 * 1000);
            //alert(dms - Number(day)*24*3600*1000);
            let ms = dms + mms + yms;
            //alert(typeof(new Date(ms)))
            return new Date(ms);
        } else {
            return new Date(0);
        }
    }

    static getDaysInMonth(month:number, year:number): number {
        if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        } else if(month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
        } else if(month == 2) {
            if(this.isYearLeap(year)) {
                return 29;
            } else {
                return 28;
            }
        } else {
            return 0;
        }
    }

    static isYearLeap(year:number): boolean {
        let leap = false;
        if(year%4==0) {
            leap = true;
            if(year % 100 == 0 && year % 400 != 0) {
                leap = false;
            }
        }    
        return leap;
    }
}  