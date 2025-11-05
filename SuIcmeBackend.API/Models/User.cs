namespace SuIcmeBackend.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int DailyTargetMl { get; set; } = 2000;
        public DateTime CreatedAt { get; set; }
    }
}