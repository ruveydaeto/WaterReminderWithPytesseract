import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {  // ← İsim: ApiService (Api değil!)
  // Backend URL
  private apiUrl = 'http://localhost:5138/api';

  constructor(private http: HttpClient) { }

  // ========================================
  // WATER INTAKE METODLARI
  // ========================================

  // Bugün içilen su miktarı
  getTodayTotal(): Observable<any> {
    return this.http.get(`${this.apiUrl}/waterintake/today`);
  }

  // Su ekle
  addWater(amountMl: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/waterintake`, { amountMl });
  }

  // Geçmiş kayıtlar
  getHistory(days: number = 7): Observable<any> {
    return this.http.get(`${this.apiUrl}/waterintake/history?days=${days}`);
  }

  // Bugünü sıfırla
  resetToday(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/waterintake/reset`);
  }

  // ========================================
  // REMINDER METODLARI
  // ========================================

  // Hatırlatma ayarlarını getir
  getReminderSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reminder`);
  }

  // Ayarları güncelle
  updateReminderSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reminder`, settings);
  }

  // Hatırlatma kontrolü
  checkShouldRemind(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reminder/check`, {});
  }
}