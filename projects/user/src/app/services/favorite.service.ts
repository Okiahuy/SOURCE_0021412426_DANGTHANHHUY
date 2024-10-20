import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FavoriteService {
    private apiUrl = 'http://localhost:8081/api/favourites/toggle'; // URL đến API toggle yêu thích

    private apiUrlfavourites = 'http://localhost:8081/api/favourites/favorites'; // URL đến API toggle yêu thích

    private apiUrlgetlikes = 'http://localhost:8081/api/products/likes';

    private apiUrlCheckFavorite = 'http://localhost:8081/api/favourites/check'; // URL API

  constructor(private http: HttpClient) {}


  toggleFavorite(userID: number, productID: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    
    // Tạo request body cho API toggle
    const body = new URLSearchParams();
    body.set('userID', userID.toString());
    body.set('productID', productID.toString());

    return this.http.post(this.apiUrl, body.toString(), { headers });
    }

    getLikesForProduct(productID: number): Observable<any> {
        return this.http.get(`${this.apiUrlgetlikes}?productID=${productID}`);
    }

    // Lấy danh sách sản phẩm yêu thích theo userID
  getFavoriteProducts(userID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlfavourites}?userID=${userID}`);
  }

    // Gửi yêu cầu kiểm tra trạng thái yêu thích
    checkFavorite(userID: number, productID: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrlCheckFavorite}?userID=${userID}&productID=${productID}`);
    }

}
