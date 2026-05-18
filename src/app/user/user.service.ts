import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './model/user';

@Injectable({
providedIn: 'root'
})
export class UserService { 

    constructor(
        private http: HttpClient
    ) { }

    getCategories(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:8080/user');
    }

    saveCategory(category: User): Observable<User> {
         let url = 'http://localhost:8080/user';
        if (category.id != null) url += '/'+category.id;

        return this.http.put<User>(url, category);
    }

    deleteCategory(idUser : number): Observable<any> {
       return this.http.delete('http://localhost:8080/user/'+idUser);
    }  
}