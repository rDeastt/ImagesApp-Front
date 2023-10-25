import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, catchError, throwError, Subject} from 'rxjs';
import {Image} from "../model/images";
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8080/image'; // Reemplaza con la URL de tu API REST en Spring Boot
  private listaChange =new Subject<Image[]>();

  constructor(private http: HttpClient) {}
  list(): Observable<any> {
    return this.http.get<Image[]>(this.apiUrl+"/list")
  }
  uploadImage(image: FormData): Observable<any> {
    const url = `${this.apiUrl}/upload`;
    return this.http.post(url, image)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error en la solicitud:', error);
          return throwError('Hubo un error al subir la imagen.');
        })
      );
  }
  setList(newList:Image[]){
    this.listaChange.next(newList);
  }
  getList(){
    return this.listaChange.asObservable();
  }
  deleteImage(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error en la solicitud:', error);
          return throwError('Hubo un error al eliminar la imagen.');
        })
      );
  }

}
