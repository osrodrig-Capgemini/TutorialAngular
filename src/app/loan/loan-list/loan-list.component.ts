import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { Pageable } from 'src/app/core/model/page/Pageable';
import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/user/model/user';
import { Game } from 'src/app/game/model/game';
import { GameService } from 'src/app/game/game.service';
import { UserService } from 'src/app/user/user.service';
import { DateAdapter } from '@angular/material/core';


@Component({
selector: 'app-loan-list',
templateUrl: './loan-list.component.html',
styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {

    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'user', 'game', 'startDate', 'endDate', 'action'];

    filterTitle: Game | undefined;
    filterUser: User | undefined;
    filterDate!: Date |undefined;

    games!: Game[];
    users!: User[];

    constructor(
        private loanService: LoanService,
        private gameService: GameService,
        private userService: UserService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.gameService.getGames().subscribe(
            games => this.games = games
        );
        this.userService.getUsers().subscribe(
            users => this.users = users
        );
        this.loadPage();
    }

    loadPage(event?: PageEvent) {

        let date = this.filterDate;
         let dateText = undefined;
        if(date != undefined) {
            dateText= Loan.stringifySafe(date);
            //alert(dateText);
        }
        
        let gameId = this.filterTitle != null ? this.filterTitle.id : undefined;
        let userId = this.filterUser != null ? this.filterUser.id : undefined;

        let pageable : Pageable =  {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{
                property: 'id',
                direction: 'ASC'
            }]
        }

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        this.loanService.getLoans(pageable,gameId==undefined?null:gameId, userId==undefined?null:userId, dateText==undefined?null:dateText).forEach(data => {
            for(let loan of data.content) {
                loan.startDate = new Date((new Date(loan.startDate)).getTime()+ (24 * 3600 * 1000))
                loan.endDate = new Date(new Date(loan.endDate).getTime()+ (24 * 3600 * 1000))
                loan.startDateText = Loan.stringifySafe(loan.startDate);
                loan.endDateText = Loan.stringifySafe(loan.endDate);
            }

            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
            
            if((this.filterUser!=undefined || this.filterTitle!=undefined || this.filterDate!=undefined) && this.totalElements > data.content.length && this.totalElements >= this.pageSize) {
                this.totalElements = data.content.length;
            }
            
        }).catch((error:HttpErrorResponse) => {
        
        if(typeof(error.error) == 'string') {
            alert(error.error)
        }
        });
    } 

    createLoan() {
        const dialogRef = this.dialog.open(LoanEditComponent, {
            data: {gameFilter:this.filterTitle, userFilter:this.filterUser, dateFilter:this.filterDate}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });
    }  

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEditComponent, {
            data: {loan:loan, gameFilter:this.filterTitle, userFilter:this.filterUser, dateFilter:this.filterDate}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });    
    }

    deleteLoan(loan: Loan) {    
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            data: { title: "Eliminar préstamo", description: "Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el autor?" }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe(result =>  {
                    this.ngOnInit();
                }); 
            }
        });
    } 

    onCleanFilter(): void {
        this.filterTitle = undefined;
        this.filterUser = undefined;
        this.filterDate = undefined;

        this.ngOnInit();
    }

    onSearch(event?: PageEvent): void {

        let date = this.filterDate;
         let dateText = undefined;
        if(date != undefined) {
            dateText= Loan.stringifySafe(date);
            //alert(dateText);
        }
        
        let gameId = this.filterTitle != null ? this.filterTitle.id : undefined;
        let userId = this.filterUser != null ? this.filterUser.id : undefined;

        let pageable : Pageable =  {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{
                property: 'id',
                direction: 'ASC'
            }]
        }

        if (event != null) {
            pageable.pageSize = event.pageSize
            pageable.pageNumber = event.pageIndex;
        }

        this.loanService.getLoans(pageable, gameId==undefined?null:gameId, userId==undefined?null:userId, dateText==undefined?null:dateText).forEach(data => {
            for(let loan of data.content) {
                loan.startDate = new Date((new Date(loan.startDate)).getTime()+ (24 * 3600 * 1000))
                loan.endDate = new Date(new Date(loan.endDate).getTime()+ (24 * 3600 * 1000))
                loan.startDateText = Loan.stringifySafe(loan.startDate);
                loan.endDateText = Loan.stringifySafe(loan.endDate);
            }
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
            //alert((this.filterUser!=undefined || this.filterTitle!=undefined || this.filterDate!=undefined)+" - "+(this.totalElements > data.content.length)+" - "+(this.totalElements >= this.pageSize));
            if((this.filterUser!=undefined || this.filterTitle!=undefined || this.filterDate!=undefined) && this.totalElements > data.content.length && this.totalElements >= this.pageSize) {
                this.totalElements = data.content.length;
            }
            
        }).catch((error:HttpErrorResponse) => {
        
        if(typeof(error.error) == 'string') {
            alert(error.error)
        }
        });
    }
}