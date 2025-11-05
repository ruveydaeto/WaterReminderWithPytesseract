namespace SuIcmeBackend.API.Models
{
    public class WaterInTake
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AmountMl { get; set; }
        public DateTime Date { get; set; }
    }
}