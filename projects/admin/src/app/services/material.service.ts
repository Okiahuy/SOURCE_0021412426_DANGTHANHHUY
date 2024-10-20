import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Material } from '../models/material.model'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MaterialService {
  
  private apiUrl = 'http://localhost:8081/api/materials'; // Đường dẫn API danh mục

  constructor(private http: HttpClient) {}

  // Lấy Material theo ID
  getMaterialById(materialID: number) {
    return this.http.get(`${this.apiUrl}/${materialID}`);
  }
  // Lấy tất cả Material
  getAllMaterial(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }
  //thêm Material
  addMaterial(material: any): Observable<any> {
    return this.http.post(this.apiUrl, material);
  }
  //Material DANH MỤC
  updateMaterial(material: Material): Observable<any> {
    return this.http.put(`${this.apiUrl}/${material.materialID}`, material);
  }
  //XÓA Material THEO ID
  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  //TÌM KIẾM Material THEO TÊN
  searchMaterialByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?name=${name}`);
  }


}