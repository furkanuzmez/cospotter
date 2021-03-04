using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using co_spotter.Data;

namespace cospotter.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170415113715_db")]
    partial class db
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("co_spotter.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.Property<string>("companyId");

                    b.Property<string>("fullname");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.HasIndex("companyId");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("co_spotter.Models.Company", b =>
                {
                    b.Property<string>("companyId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("active");

                    b.Property<string>("address");

                    b.Property<DateTime>("createdAt");

                    b.Property<string>("email");

                    b.Property<string>("logoImgSrc");

                    b.Property<string>("name");

                    b.Property<string>("phone");

                    b.Property<string>("website");

                    b.HasKey("companyId");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("co_spotter.Models.Department", b =>
                {
                    b.Property<string>("departmentId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.Property<string>("projectId");

                    b.HasKey("departmentId");

                    b.HasIndex("projectId");

                    b.ToTable("Department");
                });

            modelBuilder.Entity("co_spotter.Models.Invitation", b =>
                {
                    b.Property<string>("invitationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("code");

                    b.Property<string>("departmentId");

                    b.Property<string>("email");

                    b.Property<bool>("response");

                    b.Property<string>("roleId");

                    b.HasKey("invitationId");

                    b.HasIndex("departmentId");

                    b.ToTable("Invitation");
                });

            modelBuilder.Entity("co_spotter.Models.Note", b =>
                {
                    b.Property<string>("noteId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("content");

                    b.Property<DateTime>("createdAt");

                    b.Property<string>("noteTypeId");

                    b.Property<string>("staffId");

                    b.Property<string>("zoneId");

                    b.HasKey("noteId");

                    b.HasIndex("noteTypeId");

                    b.HasIndex("staffId");

                    b.HasIndex("zoneId");

                    b.ToTable("Note");
                });

            modelBuilder.Entity("co_spotter.Models.NoteImage", b =>
                {
                    b.Property<string>("noteImageId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("imgSrc");

                    b.Property<string>("noteId");

                    b.Property<string>("staffId");

                    b.HasKey("noteImageId");

                    b.HasIndex("noteId");

                    b.HasIndex("staffId");

                    b.ToTable("NoteImage");
                });

            modelBuilder.Entity("co_spotter.Models.NoteType", b =>
                {
                    b.Property<string>("noteTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.HasKey("noteTypeId");

                    b.ToTable("NoteType");
                });

            modelBuilder.Entity("co_spotter.Models.Notification", b =>
                {
                    b.Property<string>("notificationId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("process");

                    b.Property<string>("tableName");

                    b.Property<string>("tupleId");

                    b.HasKey("notificationId");

                    b.ToTable("Notification");
                });

            modelBuilder.Entity("co_spotter.Models.Pin", b =>
                {
                    b.Property<string>("pinId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("active");

                    b.Property<string>("content");

                    b.Property<int>("coordX");

                    b.Property<int>("coordY");

                    b.Property<DateTime>("createdAt");

                    b.Property<string>("pinTypeId");

                    b.Property<string>("planId");

                    b.Property<string>("staffId");

                    b.HasKey("pinId");

                    b.HasIndex("pinTypeId");

                    b.HasIndex("planId");

                    b.HasIndex("staffId");

                    b.ToTable("Pin");
                });

            modelBuilder.Entity("co_spotter.Models.PinType", b =>
                {
                    b.Property<string>("pinTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.HasKey("pinTypeId");

                    b.ToTable("PinType");
                });

            modelBuilder.Entity("co_spotter.Models.Plan", b =>
                {
                    b.Property<string>("planId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("active");

                    b.Property<DateTime>("createdAt");

                    b.Property<int>("height");

                    b.Property<string>("imgSrc");

                    b.Property<string>("name");

                    b.Property<string>("projectId");

                    b.Property<string>("thumbImgSrc");

                    b.Property<int>("width");

                    b.HasKey("planId");

                    b.HasIndex("projectId");

                    b.ToTable("Plan");
                });

            modelBuilder.Entity("co_spotter.Models.Project", b =>
                {
                    b.Property<string>("projectId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("companyId");

                    b.Property<string>("description");

                    b.Property<DateTime>("estimatedFinishtDate");

                    b.Property<DateTime>("finishDate");

                    b.Property<string>("imgSrc");

                    b.Property<string>("name");

                    b.Property<DateTime>("startDate");

                    b.HasKey("projectId");

                    b.HasIndex("companyId");

                    b.ToTable("Project");
                });

            modelBuilder.Entity("co_spotter.Models.ReadNotification", b =>
                {
                    b.Property<string>("readNotificationId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("notificationId");

                    b.Property<DateTime>("readDate");

                    b.Property<string>("staffId");

                    b.HasKey("readNotificationId");

                    b.HasIndex("notificationId");

                    b.HasIndex("staffId");

                    b.ToTable("ReadNotification");
                });

            modelBuilder.Entity("co_spotter.Models.Staff", b =>
                {
                    b.Property<string>("staffId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Id");

                    b.Property<string>("departmentId");

                    b.HasKey("staffId");

                    b.HasIndex("Id");

                    b.HasIndex("departmentId");

                    b.ToTable("Staff");
                });

            modelBuilder.Entity("co_spotter.Models.Zone", b =>
                {
                    b.Property<string>("zoneId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("coordX");

                    b.Property<int>("coordY");

                    b.Property<DateTime>("createdAt");

                    b.Property<string>("name");

                    b.Property<string>("planId");

                    b.Property<bool>("released");

                    b.Property<string>("zoneTypeId");

                    b.HasKey("zoneId");

                    b.HasIndex("planId");

                    b.HasIndex("zoneTypeId");

                    b.ToTable("Zone");
                });

            modelBuilder.Entity("co_spotter.Models.ZoneType", b =>
                {
                    b.Property<string>("zoneTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("name");

                    b.Property<string>("projectId");

                    b.Property<string>("zoneTypeColor");

                    b.HasKey("zoneTypeId");

                    b.HasIndex("projectId");

                    b.ToTable("ZoneType");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("co_spotter.Models.ApplicationUser", b =>
                {
                    b.HasOne("co_spotter.Models.Company", "company")
                        .WithMany()
                        .HasForeignKey("companyId");
                });

            modelBuilder.Entity("co_spotter.Models.Department", b =>
                {
                    b.HasOne("co_spotter.Models.Project", "project")
                        .WithMany()
                        .HasForeignKey("projectId");
                });

            modelBuilder.Entity("co_spotter.Models.Invitation", b =>
                {
                    b.HasOne("co_spotter.Models.Department", "department")
                        .WithMany()
                        .HasForeignKey("departmentId");
                });

            modelBuilder.Entity("co_spotter.Models.Note", b =>
                {
                    b.HasOne("co_spotter.Models.NoteType", "noteType")
                        .WithMany()
                        .HasForeignKey("noteTypeId");

                    b.HasOne("co_spotter.Models.Staff", "staff")
                        .WithMany()
                        .HasForeignKey("staffId");

                    b.HasOne("co_spotter.Models.Zone", "zone")
                        .WithMany()
                        .HasForeignKey("zoneId");
                });

            modelBuilder.Entity("co_spotter.Models.NoteImage", b =>
                {
                    b.HasOne("co_spotter.Models.Note", "note")
                        .WithMany()
                        .HasForeignKey("noteId");

                    b.HasOne("co_spotter.Models.Staff", "staff")
                        .WithMany()
                        .HasForeignKey("staffId");
                });

            modelBuilder.Entity("co_spotter.Models.Pin", b =>
                {
                    b.HasOne("co_spotter.Models.PinType", "pinType")
                        .WithMany()
                        .HasForeignKey("pinTypeId");

                    b.HasOne("co_spotter.Models.Plan", "plan")
                        .WithMany()
                        .HasForeignKey("planId");

                    b.HasOne("co_spotter.Models.Staff", "staff")
                        .WithMany()
                        .HasForeignKey("staffId");
                });

            modelBuilder.Entity("co_spotter.Models.Plan", b =>
                {
                    b.HasOne("co_spotter.Models.Project", "project")
                        .WithMany()
                        .HasForeignKey("projectId");
                });

            modelBuilder.Entity("co_spotter.Models.Project", b =>
                {
                    b.HasOne("co_spotter.Models.Company", "company")
                        .WithMany()
                        .HasForeignKey("companyId");
                });

            modelBuilder.Entity("co_spotter.Models.ReadNotification", b =>
                {
                    b.HasOne("co_spotter.Models.Notification", "notification")
                        .WithMany()
                        .HasForeignKey("notificationId");

                    b.HasOne("co_spotter.Models.Staff", "staff")
                        .WithMany()
                        .HasForeignKey("staffId");
                });

            modelBuilder.Entity("co_spotter.Models.Staff", b =>
                {
                    b.HasOne("co_spotter.Models.ApplicationUser", "user")
                        .WithMany()
                        .HasForeignKey("Id");

                    b.HasOne("co_spotter.Models.Department", "department")
                        .WithMany()
                        .HasForeignKey("departmentId");
                });

            modelBuilder.Entity("co_spotter.Models.Zone", b =>
                {
                    b.HasOne("co_spotter.Models.Plan", "plan")
                        .WithMany()
                        .HasForeignKey("planId");

                    b.HasOne("co_spotter.Models.ZoneType", "zoneType")
                        .WithMany()
                        .HasForeignKey("zoneTypeId");
                });

            modelBuilder.Entity("co_spotter.Models.ZoneType", b =>
                {
                    b.HasOne("co_spotter.Models.Project", "project")
                        .WithMany()
                        .HasForeignKey("projectId");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("co_spotter.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("co_spotter.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("co_spotter.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
