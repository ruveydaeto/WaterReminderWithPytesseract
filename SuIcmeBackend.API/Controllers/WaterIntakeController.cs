using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuIcmeBackend.API.Data;
using SuIcmeBackend.API.Models;


//Controller aslında ui ın istediği şeyi database e ileten kısımdır.Örneğin angular müşteri olsun;"200ml su ekle" diyor ve garson ise controller olsun;"Tamam mutfağa söylüyorum"
//diyerek mutfağa iletiyor ve  mutfak burada database . Database de bu içilne su miktarını kaydediyor.


namespace SuIcmeBackend.API.Controllers
{
    [ApiController] // bu class bir API controller'ı demek için
    [Route("api/[controller]")]
    public class WaterIntakeController : ControllerBase
    {

        //database e bağlanalım
        private readonly AppDbContext _context; //context burada veritabanı ile konuşan  aracı

        public WaterIntakeController(AppDbContext context) //AppDbContext baplantı tipi
        {
            _context = context; //artık contexti her yerde kullanabilirim
        }

        //BUGUN İÇİLEN SU MİKTARI
        [HttpGet("today")]

        //Bugün içilen total su miktarını 
        public async Task<ActionResult> GetTodayTotal()
        {
            //bugünün tarihi
            var today = DateTime.Today;

            var total = await _context.WaterIntakes
                .Where(w => w.Date.Date == today) //Viewdan gelen Date**
                .SumAsync(w => w.AmountMl); //viewdan gelen AmountMl

            //sunucuda JSON olarak döndürelim
            return Ok(new { totalMl = total });
        }


        //SU EKELME

        [HttpPost]
        public async Task<ActionResult> AddWater([FromBody] AddWaterRequest request) //FromBody deemek bu veri HTTP Body den gelicek
        {
            // yeni kayıt oluştur

            var newRecord = new WaterInTake
            {
                UserId = 1,
                AmountMl = request.AmountMl, //Angulardan geelen miktar
                Date = DateTime.UtcNow
            };

            //database ekle ve kaydet
            _context.WaterIntakes.Add(newRecord);
            await _context.SaveChangesAsync();

            //bugünün yeni toplamını hespala
            var todayTotal = await _context.WaterIntakes
                .Where(w => w.Date.Date == DateTime.Today)
                .SumAsync(w => w.AmountMl);

            //cevap döndür
            return Ok(new { message = "Su eklendi", todayTotal });
        }


        //7 günlük geçmiş su içilme verisini alamk istiyoruz

        [HttpGet("History")]
        public async Task<ActionResult> GetHistory([FromQuery] int days = 7)
        //async diyoruz çünkü asenkron yani beklemeden çalışıyor ve ActionResult HTTP cevabı anlamına geliyo Task ile de ActionResult gelecekte bu cevabı dönecek anlamına geliyor
        //Task; şuan hazır değil gelecekte hazır olacak dmeek oluyor
        //FromQuery; bu parametre url den gelecek anlaına geliyor, https://example.com/api/waterintake/history?days07 vb
        {
            var startDate = DateTime.Today.AddDays(-days);
            var records = await _context.WaterIntakes
                .Where(w => w.Date >= startDate)
                .OrderByDescending(w => w.Date)
                .ToListAsync();
            return Ok(records);
        }

        [HttpDelete("reset")]
        public async Task<ActionResult> ResetToday()
        {
            var today = DateTime.Today;
            var todayRecords = await _context.WaterIntakes
                .Where(w => w.Date.Date == today).ToListAsync();

            _context.WaterIntakes.RemoveRange(todayRecords);
            await _context.SaveChangesAsync();
            return Ok(new { message= "Sıfırlandı!" });
        }
    }

    //LINQ (WHERE,SUM,ORDERBY)
    //.Where() =filtreleme (SQL'deki WHERE gibi)
    //.SumAsync() = Topla (SQL'deki SUM gibi)
    //.OrderByDescending() = Sırala (büyükten küçğe)
    //.ToListAssync() = listeye çevir

        public class AddWaterRequest
        {
            public int AmountMl { get; set; }
        }
    }

