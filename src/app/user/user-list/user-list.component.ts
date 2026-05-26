import { User } from '../model/user';
import { UserService } from '../user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'src/app/core/dialog-confirmation/dialog-confirmation.component';
import { UrlSerializer } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    @Inject(UserService) private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (categories: User[]) => this.dataSource.data = categories
    );
  }

  createCategory() {    
    const dialogRef = this.dialog.open(UserEditComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });    
  } 

  editCategory(user: User) {
    const dialogRef = this.dialog.open(UserEditComponent, {
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteCategory(user: User) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: { title: "Eliminar usuario", description: "Atención si borra el usuario se perderán sus datos.<br> ¿Desea eliminar el usuario?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteCategory(user.id).subscribe(result => {
          this.ngOnInit();
        }); 
      }
    });
  } 
}