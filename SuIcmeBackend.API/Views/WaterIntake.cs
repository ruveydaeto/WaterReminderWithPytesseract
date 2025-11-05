//Database de neleri kaydetmke istiyorum? 1.içilen su miktarını 2.ne zaman içildiğini 3. hangi kullanıcıya ait? UserId
//4.Kayıtları nasıl ayırt edeceğiz? Kayıt ID 

namespace SuIcmeBackend.API.Views
{
    public class WaterIntake
    {
        public int ID { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public int AmountMl { get; set; }

    }
}
