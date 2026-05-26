import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import {LoanPage} from "./model/loan-page"
import { Loan } from './model/loan';
import { Game } from '../game/model/game';
import { User } from '../user/model/user';
@Injectable({
    providedIn: 'root'
})
export class LoanService {

    constructor(
        private http: HttpClient
    ) { }
    private composeFindUrl(gameId?:number | null, userId?: number | null, date?: string | null) : string {
        let params = '';

        if (typeof(date) != null && date != "null" && typeof(date) != "undefined" && date != "undefined") {
            //alert(date + " - "+typeof(date))
            params += 'date='+date;
        }

        if (typeof(gameId) != null && typeof(gameId) != "undefined" && ""+gameId!="null" && ""+gameId!="undefined") {
            if (params != '') params += "&";
            params += "idGame="+gameId;
        }
        
        if (typeof(userId) != null && typeof(userId) != "undefined" && ""+userId!="null" && ""+userId!="undefined") {
            if (params != '') params += "&";
            params += "idUser="+userId;
        }
        if(params.toUpperCase == params.toLocaleLowerCase) {
            params = ''
        }
        let url = 'http://localhost:8080/loan'
        //alert(params==''?url:url+'?'+params)
        if (params == '') return url;
        else return url + '?'+params;
    }

    getLoans(pageable: Pageable, gameId?: number | null, userId?: number | null, date?: string | null ): Observable<LoanPage> {
        
        let response = this.http.post<LoanPage>(this.composeFindUrl(gameId,userId,date), {pageable:pageable});
        return response;
    }



    saveLoan(loan: Loan, editing?: boolean | undefined): Observable<void> {

        let url = 'http://localhost:8080/loan';
        if (loan.id != null) url += '/'+loan.id;
        if(editing !== undefined) {
            url += "?editing="+editing;
        }

        loan.startDate = new Date(loan.startDate);
        loan.endDate = new Date(loan.endDate);
        loan.startDateText = Loan.stringifySafe(loan.startDate)
        console.log(typeof(new Date(loan.startDate)))
        loan.endDateText = Loan.stringifySafe(loan.startDate)
        
        console.log(typeof(new Date(loan.endDate)))
        
        
        let response = this.http.put<void>(url, loan);
        
        return response;
    }

    deleteLoan(idLoan : number): Observable<void> {
        let response = this.http.delete<void>('http://localhost:8080/loan/'+idLoan);
        
        return response;
    }    

    getAllLoan(): Observable<Loan[]> {
        let response = this.http.get<Loan[]>('http://localhost:8080/loan');
        
        return response;
    }

    findAllGames():Observable<Game[]> {
        let response = this.http.get<Game[]>('http://localhost:8080/loan/getgames');
        
        return response;
    }

    findAllUsers():Observable<User[]> {
        let response = this.http.get<User[]>('http://localhost:8080/loan/getusers');
       

        
        return response 
    }

    

}