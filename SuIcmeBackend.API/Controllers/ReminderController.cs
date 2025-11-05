//1.databaseden ilk kaydı getirmeli(ilk su içtim kaydını)
//'2.eğer db de hiç kayıt yoksa yani null ise yeni kayıt oluştur(viewdan bakıp )ve db ye ekle
//ayarları güncelle put isteği
//hatırlatma zamanının gelip glemediğini check edicek,eğer hatırlatma zamnı geldiyse şimdi ile güncelle

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuIcmeBackend.API.Data;

namespace SuIcmeBackend.API.Controllers
{
    //bu bir API conreollerı
    [ApiController]
    [Route("api/[controller]")] //url api/reminder

    public class ReminderController : ControllerBase
    {
        //db ye bağlanalım
        private readonly AppDbContext _context;

        public ReminderController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetSettings()
        {
            //db deki iilk ayarı bul ve getir
            var settings = await _context.ReminderSettings.FirstOrDefaultAsync();
            //FirstOrDefaultAsync;ilk kaydı al yoksa null döndür

            if (settings == null)
            {
                //yeni ayar oluştur
                settings = new Models.ReminderSettings
                {
                    UserId = 1,
                    IsEnabled = true,
                    IntervalMinutes = 60,
                    LastReminderTime = DateTime.UtcNow,
                };
                _context.ReminderSettings.Add(settings);
                await _context.SaveChangesAsync();
            }
            //Ayarları JSON olarak döndür
            return Ok(settings);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateSettings([FromBody] UpdateReminderRequest request)
        {
            //db den mevcut ayarı alalım
            var settings = await _context.ReminderSettings.FirstOrDefaultAsync();
            //eğer yoksa hata döndür
            if(settings == null)
            {
                return NotFound(new { message = "Ayar bulunamadı" });
            }

            // ayarları güncelleme zamanı
            //Angulardan gelen yeni değerleri db deki eski değerlerşn üzerine yazdık 
            //request aslında angulardan elen veri
            settings.IsEnabled = request.isEnabled;
            settings.IntervalMinutes = request.IntervalMinutes;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Ayarlar güncellendi!!" });
            
        }


        //Hatırlatma zamanı geldimi check

        [HttpPost("check")]
        public async Task<ActionResult> CheckShouldRemind()
        {
            // db den ayarları alaım
            var settings = await _context.ReminderSettings.FirstOrDefaultAsync();
            //Eğer ayar yoksa veya kapalıysa hatırlatma yapma
            if(settings == null || !settings.IsEnabled)
            {
                return Ok(new { shouldRemind = false });
            }

            //şuanki zaman
            var now = DateTime.UtcNow;

            //son hatırlatmadan sonra geçen zmaan
            var timeSinceLastReminder = now - settings.LastReminderTime;

            //hatırlatma yapmak için zaman geldi mi?
            var shouldReminder = timeSinceLastReminder.TotalMinutes >= settings.IntervalMinutes;
            // örnek 60 dakika >= 60 dakika => true (hatırlat

            //eğer hatırlatma zamaanı geldiyse
            if(shouldReminder)
            {
                //son hatırlatma zamanını şimdi olarak güncelle
                settings.LastReminderTime = now;

                //database e kaydet
                await _context.SaveChangesAsync();

            }
            return Ok(new { shouldReminder });

        }



        public class UpdateReminderRequest
        {
            public bool isEnabled { get; set;  }
            public int IntervalMinutes { get; set; }
        }
    }
}
