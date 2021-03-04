using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using co_spotter.Models;

namespace co_spotter.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        public DbSet<Company> company { get; set; }

        public DbSet<Department> department { get; set; }

        public DbSet<Invitation> invitation { get; set; }

        public DbSet<Note> note { get; set; }

        public DbSet<NoteImage> noteImage { get; set; }

        public DbSet<Notification> notification { get; set; }

        public DbSet<Pin> pin { get; set; }

        public DbSet<PinType> pinType { get; set; }

        public DbSet<Plan> plan { get; set; }

        public DbSet<Project> project { get; set; }

        public DbSet<ReadNotification> readNotification { get; set; }

        public DbSet<Staff> staff { get; set; }

        public DbSet<Zone> zone { get; set; }

        public DbSet<ZoneType> zoneType { get; set; }
        public DbSet<NoteType> noteType { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
