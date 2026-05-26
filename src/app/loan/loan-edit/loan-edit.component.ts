import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Loan } from '../model/loan';
import { LoanService } from '../loan.service';
import { User } from '../../user/model/user'
import { Game } from '../../game/model/game'
import { HttpErrorResponse } from '@angular/common/http';

@Component({
selector: 'app-loan-edit',
templateUrl: './loan-edit.component.html',
styleUrls: ['./loan-edit.component.scss']
})
export class LoanEditComponent implements OnInit {

    loan!: Loan;
    users!: User[];
    games!: Game[];
    editing!: boolean;

    constructor(
        public dialogRef: MatDialogRef<LoanEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loanService: LoanService
    ) { }

    ngOnInit(): void {
        if (this.data.loan != null || this.data.loan != undefined) {
           //alert( this.data.loan.gameName)
            this.loan = Object.assign({}, this.data.loan);
           this.editing = true;
        }
        else {
            this.loan = new Loan();
            this.editing = false;
        }

        this.loanService.findAllGames().forEach(games => {
            this.games = games;
            if(this.loan.gameId!=null) {
                let gNameFilter: Game[] = this.games.filter(game => game.id == this.loan.gameId);
                if(gNameFilter != null) {
                    this.loan.game = gNameFilter[0]
                }
            }
            
        }).catch((error:HttpErrorResponse) => {
                 alert("Error: "+error.error)
        })
            
        

        this.loanService.findAllUsers().forEach(users => {
            this.users = users;
            if(this.loan.userId!=null) {
                let uNameFilter: User[] = this.users.filter(user => user.id == this.loan.userId);
                if(uNameFilter != null) {
                    this.loan.user = uNameFilter[0]
                }

            }
            
        }).catch((error:HttpErrorResponse) => {
        
        if(typeof(error.error) == 'string') {
            alert("Error: "+error.error)
        }
        });

        
        


    }

    onSave() {

        //alert (this.loan.startDate.toDateString());
        this.loan.userId = this.loan.user.id;
        this.loan.userName = this.loan.user.name;
        this.loan.gameId = this.loan.game.id;
        this.loan.gameName = this.loan.game.title;
        let obs = this.loanService.saveLoan(this.loan, this.editing);

        obs.forEach(result =>  {
            
        }).catch((error:HttpErrorResponse) => {
        
        if(typeof(error.error) == 'string') {
            alert(error.error)
        }
        });
        
        this.dialogRef.close();
    }  

    onClose() {
        this.dialogRef.close();
    }

}