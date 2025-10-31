// water-bottle.component.ts Ne Yapar?
// 1. servic'den veriyi alır. service bağlanmak için constructor(public reminderService: ReminderService) {} 
// service'den gelen veriyi kopyalar .örneğin service de waterAmount değerini tutuyoruz component bu state kendi içinde kopyalar ki
// html de kullanabilsin.(kullanmak için lokal kopya gerekiyor) . bunun içinde service den gelen veriyi dinlemesi lazım=> ngOnInit ile
// 2. Kullanıcı etkişelşimini yönetir. Yani service de olanları kullancıya gösterir
// mesela kullancııya su içtim mesaını gösterebilmek için service deki drinkWater ı kullanır.

// 1. Kullanıcı butona tıkladı
//    ↓
// 2. onDrinkWater() çalıştı (Component'te)
//    ↓
// 3. reminderService.drinkWater() çağrıldı (Service'te)
//    ↓
// 4. Service state'i güncelledi
//    ↓
// 5. subscribe() callback çalıştı (Component'te)
//    ↓
// 6. Component state güncellendi
//    ↓
// 7. HTML yeniden render edildi




import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReminderService } from '../../services/reminder.services';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
selector: 'app-water-bottle',
  standalone: true, // ← Eğer standalone component ise
  imports: [DatePipe, CommonModule], // ← EKLE
  templateUrl: './water-bottle.component.html',
  styleUrls: ['./water-bottle.component.css']
  
  
})

export class WaterBottleComponent implements OnInit {
    waterAmount = 0;
    nextReminder : Date = new Date();
     remainingGlasses = 10;
     waterPercentage = 0;

     private subscriptions: Subscription[] = [];



    constructor(public reminderService: ReminderService) { }

    ngOnInit(): void {
        //su miktarını kopyalayıp dinleyelim
        const waterSub = this.reminderService.waterAmount$.subscribe(amount => {
            this.waterAmount = amount;
            this.waterPercentage = this.reminderService.getWaterPercentage();
            this.remainingGlasses = this.reminderService.getRemainingGlasses();
        })

        //sonraki hatırlatmayı dinleyelim
        const reminderSub = this.reminderService.nextReminder$.subscribe(date => {
            this.nextReminder = date;
        })

        this.subscriptions.push(waterSub, reminderSub);
     }

     ngOnDestroy(): void {
        //component unmount olduğunda
        this.subscriptions.forEach(sub => sub.unsubscribe());
     }

     onDrinkWater(): void {
        this.reminderService.drinkWater();
     }


}