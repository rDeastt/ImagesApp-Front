import { Component, OnInit } from '@angular/core';
import { ImageService } from '../service/image.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {ChangeDetectorRef} from "@angular/core";
import {Image} from '../model/images'
@Component({
  selector: 'app-homeuser',
  templateUrl: './homeuser.component.html',
  styleUrls: ['./homeuser.component.css']
})
export class HomeuserComponent implements OnInit {
  imagenes: Image[] = []
  selectedFile: File | null = null;
  isFullscreen: boolean = false;
  fullscreenImage: string = '';

  toggleFullscreen(event: MouseEvent, imagen?: any): void {
    if (imagen && event.target instanceof HTMLImageElement) {
      this.fullscreenImage = 'data:image/png;base64,' + imagen.imageData;
      this.isFullscreen = true;
    } else {
      this.fullscreenImage = '';
      this.isFullscreen = false;
    }
    event.stopPropagation(); //aquí se detiene la propagación al botón delete
  }
  constructor(private http: HttpClient, private imageService: ImageService, private changeDetectorRef: ChangeDetectorRef) { }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadImage() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.imageService.uploadImage(formData).subscribe(() => {
        // Lógica para manejar la respuesta del servidor (por ejemplo, mostrar un mensaje de éxito).
        this.imageService.list().subscribe(data =>{
          this.imagenes=data;
        });
        this.changeDetectorRef.detectChanges();
        this.selectedFile = null;
        });
    }
    window.location.reload();
  }

  eliminarImagen(index: number) {
    this.imageService.deleteImage(index).subscribe(() =>
       {
        // Actualizar la lista de imágenes después de eliminar una imagen
        this.imageService.list().subscribe(data => this.imagenes = data);
      },
      (error) => {
        console.error('Error al eliminar la imagen', error);
      }
    );
  }

  private actualizarListaImagenes() {
  }
  ngOnInit(): void {
    this.imageService.list().subscribe(data => this.imagenes = data);
    this.imageService.getList().subscribe(data=>{
      this.imagenes = data;
    })
  }
}
