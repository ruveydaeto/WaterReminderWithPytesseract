namespace SuIcmeBackend.API.Models
{
    public class ReminderSettings
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool IsEnabled { get; set; } = true;
        public int IntervalMinutes { get; set; } = 60;
        public DateTime LastReminderTime { get; set; }
    }
}