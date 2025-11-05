using Microsoft.EntityFrameworkCore;
using SuIcmeBackend.API.Models;
using SuIcmeBackend.API.Views;

namespace SuIcmeBackend.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<WaterInTake> WaterIntakes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ReminderSettings> ReminderSettings { get; set; }
    }
}