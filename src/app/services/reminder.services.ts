import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {
    private readonly GLASS_SIZE_ML = 200;
    private readonly TARGET_ML = 2000;
    private readonly REMINDER_INTERVAL_MS = 3600000; // 1SAAT       

    // STATE MANAGEMENT
    //su mikatarını tutalım ve başlangıç değeri 0 olsun
    private waterAmountSubject = new BehaviorSubject<number>(0);
        //waterAmount$ ile su miktarını dinleyebilmke için
    public waterAmount$ = this.waterAmountSubject.asObservable();


    //bir sonraki hatırlatma zamanını tutalım
    private nextReminderSubject = new BehaviorSubject<Date>(new Date());
    //nextReminder$ ile bir sonraki hatırlatmayı dinlyebilmek için
    public nextReminder$ = this.nextReminderSubject.asObservable();
    

    //reminder ı başlatalım

    // buranın react karşılığı:
    //useEffect(() => {
    //   startReminderTimer();
    // }, []); // [] = sadece bir kez çalış

 constructor(private apiService: ApiService) {  // ← ApiService (Api değil!)
        this.loadTodayTotal();
        this.startReminderTimer();
    }

       private loadTodayTotal(): void {  // ← BU METODU EKLE!
        this.apiService.getTodayTotal().subscribe({
            next: (response) => {
                console.log('✅ Backend\'ten toplam geldi:', response.totalMl, 'ml');
                this.waterAmountSubject.next(response.totalMl);
            },
            error: (error) => {
                console.error('❌ Backend hatası:', error);
                // Fallback: LocalStorage'dan yükle
                const stored = localStorage.getItem('waterAmount');
                if (stored) {
                    console.log('📦 LocalStorage\'dan yüklendi:', stored, 'ml');
                    this.waterAmountSubject.next(parseInt(stored));
                }
            }
        });
    }

    private checkReminderFromBackend(): void {
    this.apiService.checkShouldRemind().subscribe({
        next: (response) => {
            if (response.shouldRemind) {
                console.log('⏰ Backend: Hatırlatma zamanı geldi!');
                this.showReminder();
                this.setNextReminder();
            }
        },
        error: (error) => {
            console.error('❌ Hatırlatma kontrolü hatası:', error);
            this.showReminder();
            this.setNextReminder();
        }
    });
}
    //bu reminder.service yazmamızın belli bir amacı var; tüm stateleri burada tutabiliyorum.
    //bu sayede her componentte tekrar tekrar yazarak kod tekrarı yapmıyorum.
    // business logic ksımını burada yönetebilrim. Örneğin projenin amacı düşünüldüğünde
    // şöyle bir olay sıralaması gerçekleşecek:
    //1. Su içilecek. Peki su içildiğinde ne olacak?(drinkWater ile su içtiğinde current amountına glass_size_ml(newamount) ekleniyor)
    //Bizim bir hedef su ornaımız vardı(2000ml) Target_ml yüzde kaçının içildiğini hesaplayarak kaç ml daha içmemiz gerektiğini
    //hesaplayabiliriz.
    //reminder ksımına geçiyoruz burada ise heer 1 saatte bir uyarı vermemiz alzım

//**Prensip: Separation of Concerns 

drinkWater(): void {
    const currentAmount = this.waterAmountSubject.value;
    
    // Hedef aşılmışsa ekleme yapma
    if (currentAmount >= this.TARGET_ML) {
        alert('🎉 Tebrikler! Günlük hedefinize ulaştınız!');
        return;
    }

    // Backend'e kaydet
    this.apiService.addWater(this.GLASS_SIZE_ML).subscribe({
        next: (response) => {
            console.log('✅ Backend cevabı:', response);
            
            // Backend'den gelen güncel toplamı kullan
            const newAmount = Math.min(response.todayTotal, this.TARGET_ML);
            this.waterAmountSubject.next(newAmount);
            
            // LocalStorage'a da kaydet (fallback için)
            localStorage.setItem('waterAmount', newAmount.toString());
            
            console.log('💧 Su eklendi! Yeni toplam:', newAmount, 'ml');
            
            this.setNextReminder();
        },
        error: (error) => {
            console.error('❌ Su eklenirken hata:', error);
            
            // Offline mode - sadece local state'i güncelle
            const newAmount = Math.min(currentAmount + this.GLASS_SIZE_ML, this.TARGET_ML);
            this.waterAmountSubject.next(newAmount);
            localStorage.setItem('waterAmount', newAmount.toString());
            
            alert('⚠️ Backend\'e bağlanılamadı. Veri yerel olarak kaydedildi.');
            
            this.setNextReminder();
        }
    });
}
   private startReminderTimer(): void {
        this.setNextReminder();

        interval(1000).subscribe(() => {
            const now = new Date();
            const nextReminder = this.nextReminderSubject.value;

            if (now >= nextReminder) {
                this.checkReminderFromBackend();
            }
        });
    }


private setNextReminder(): void {
    const nextTime = new Date();
    nextTime.setTime(nextTime.getTime() + this.REMINDER_INTERVAL_MS);
    this.nextReminderSubject.next(nextTime);
}

private showReminder(): void {
    if(this.waterAmountSubject.value < this.TARGET_ML) {
         alert('💧 Su içme zamanı! Bir bardak su için.');
    }
}

  // Yüzde hesapla
  getWaterPercentage(): number {
    return (this.waterAmountSubject.value / this.TARGET_ML) * 100;
  }

  // Getter'lar
  getCurrentAmount(): number {
    return this.waterAmountSubject.value;
  }

  getTarget(): number {
    return this.TARGET_ML;
  }

  getRemainingGlasses(): number {
    return Math.ceil((this.TARGET_ML - this.waterAmountSubject.value) / this.GLASS_SIZE_ML);
  }

}