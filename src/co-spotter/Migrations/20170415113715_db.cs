using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace cospotter.Migrations
{
    public partial class db : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    companyId = table.Column<string>(nullable: false),
                    active = table.Column<bool>(nullable: false),
                    address = table.Column<string>(nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    email = table.Column<string>(nullable: true),
                    logoImgSrc = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    phone = table.Column<string>(nullable: true),
                    website = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.companyId);
                });

            migrationBuilder.CreateTable(
                name: "NoteType",
                columns: table => new
                {
                    noteTypeId = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteType", x => x.noteTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    notificationId = table.Column<string>(nullable: false),
                    process = table.Column<int>(nullable: false),
                    tableName = table.Column<string>(nullable: true),
                    tupleId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.notificationId);
                });

            migrationBuilder.CreateTable(
                name: "PinType",
                columns: table => new
                {
                    pinTypeId = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PinType", x => x.pinTypeId);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    companyId = table.Column<string>(nullable: true),
                    fullname = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_Company_companyId",
                        column: x => x.companyId,
                        principalTable: "Company",
                        principalColumn: "companyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    projectId = table.Column<string>(nullable: false),
                    companyId = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    estimatedFinishtDate = table.Column<DateTime>(nullable: false),
                    finishDate = table.Column<DateTime>(nullable: false),
                    imgSrc = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    startDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.projectId);
                    table.ForeignKey(
                        name: "FK_Project_Company_companyId",
                        column: x => x.companyId,
                        principalTable: "Company",
                        principalColumn: "companyId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    departmentId = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    projectId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.departmentId);
                    table.ForeignKey(
                        name: "FK_Department_Project_projectId",
                        column: x => x.projectId,
                        principalTable: "Project",
                        principalColumn: "projectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Plan",
                columns: table => new
                {
                    planId = table.Column<string>(nullable: false),
                    active = table.Column<bool>(nullable: false),
                    createdAt = table.Column<DateTime>(nullable: false),
                    height = table.Column<int>(nullable: false),
                    imgSrc = table.Column<string>(nullable: true),
                    name = table.Column<string>(nullable: true),
                    projectId = table.Column<string>(nullable: true),
                    thumbImgSrc = table.Column<string>(nullable: true),
                    width = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plan", x => x.planId);
                    table.ForeignKey(
                        name: "FK_Plan_Project_projectId",
                        column: x => x.projectId,
                        principalTable: "Project",
                        principalColumn: "projectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ZoneType",
                columns: table => new
                {
                    zoneTypeId = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    projectId = table.Column<string>(nullable: true),
                    zoneTypeColor = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZoneType", x => x.zoneTypeId);
                    table.ForeignKey(
                        name: "FK_ZoneType_Project_projectId",
                        column: x => x.projectId,
                        principalTable: "Project",
                        principalColumn: "projectId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Invitation",
                columns: table => new
                {
                    invitationId = table.Column<string>(nullable: false),
                    code = table.Column<string>(nullable: true),
                    departmentId = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true),
                    response = table.Column<bool>(nullable: false),
                    roleId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitation", x => x.invitationId);
                    table.ForeignKey(
                        name: "FK_Invitation_Department_departmentId",
                        column: x => x.departmentId,
                        principalTable: "Department",
                        principalColumn: "departmentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    staffId = table.Column<string>(nullable: false),
                    Id = table.Column<string>(nullable: true),
                    departmentId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staff", x => x.staffId);
                    table.ForeignKey(
                        name: "FK_Staff_AspNetUsers_Id",
                        column: x => x.Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Staff_Department_departmentId",
                        column: x => x.departmentId,
                        principalTable: "Department",
                        principalColumn: "departmentId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Zone",
                columns: table => new
                {
                    zoneId = table.Column<string>(nullable: false),
                    coordX = table.Column<int>(nullable: false),
                    coordY = table.Column<int>(nullable: false),
                    createdAt = table.Column<DateTime>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    planId = table.Column<string>(nullable: true),
                    released = table.Column<bool>(nullable: false),
                    zoneTypeId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zone", x => x.zoneId);
                    table.ForeignKey(
                        name: "FK_Zone_Plan_planId",
                        column: x => x.planId,
                        principalTable: "Plan",
                        principalColumn: "planId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Zone_ZoneType_zoneTypeId",
                        column: x => x.zoneTypeId,
                        principalTable: "ZoneType",
                        principalColumn: "zoneTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pin",
                columns: table => new
                {
                    pinId = table.Column<string>(nullable: false),
                    active = table.Column<bool>(nullable: false),
                    content = table.Column<string>(nullable: true),
                    coordX = table.Column<int>(nullable: false),
                    coordY = table.Column<int>(nullable: false),
                    createdAt = table.Column<DateTime>(nullable: false),
                    pinTypeId = table.Column<string>(nullable: true),
                    planId = table.Column<string>(nullable: true),
                    staffId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pin", x => x.pinId);
                    table.ForeignKey(
                        name: "FK_Pin_PinType_pinTypeId",
                        column: x => x.pinTypeId,
                        principalTable: "PinType",
                        principalColumn: "pinTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pin_Plan_planId",
                        column: x => x.planId,
                        principalTable: "Plan",
                        principalColumn: "planId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pin_Staff_staffId",
                        column: x => x.staffId,
                        principalTable: "Staff",
                        principalColumn: "staffId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReadNotification",
                columns: table => new
                {
                    readNotificationId = table.Column<string>(nullable: false),
                    notificationId = table.Column<string>(nullable: true),
                    readDate = table.Column<DateTime>(nullable: false),
                    staffId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadNotification", x => x.readNotificationId);
                    table.ForeignKey(
                        name: "FK_ReadNotification_Notification_notificationId",
                        column: x => x.notificationId,
                        principalTable: "Notification",
                        principalColumn: "notificationId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReadNotification_Staff_staffId",
                        column: x => x.staffId,
                        principalTable: "Staff",
                        principalColumn: "staffId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Note",
                columns: table => new
                {
                    noteId = table.Column<string>(nullable: false),
                    content = table.Column<string>(nullable: true),
                    createdAt = table.Column<DateTime>(nullable: false),
                    noteTypeId = table.Column<string>(nullable: true),
                    staffId = table.Column<string>(nullable: true),
                    zoneId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Note", x => x.noteId);
                    table.ForeignKey(
                        name: "FK_Note_NoteType_noteTypeId",
                        column: x => x.noteTypeId,
                        principalTable: "NoteType",
                        principalColumn: "noteTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Note_Staff_staffId",
                        column: x => x.staffId,
                        principalTable: "Staff",
                        principalColumn: "staffId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Note_Zone_zoneId",
                        column: x => x.zoneId,
                        principalTable: "Zone",
                        principalColumn: "zoneId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NoteImage",
                columns: table => new
                {
                    noteImageId = table.Column<string>(nullable: false),
                    imgSrc = table.Column<string>(nullable: true),
                    noteId = table.Column<string>(nullable: true),
                    staffId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteImage", x => x.noteImageId);
                    table.ForeignKey(
                        name: "FK_NoteImage_Note_noteId",
                        column: x => x.noteId,
                        principalTable: "Note",
                        principalColumn: "noteId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NoteImage_Staff_staffId",
                        column: x => x.staffId,
                        principalTable: "Staff",
                        principalColumn: "staffId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_companyId",
                table: "AspNetUsers",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_projectId",
                table: "Department",
                column: "projectId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitation_departmentId",
                table: "Invitation",
                column: "departmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Note_noteTypeId",
                table: "Note",
                column: "noteTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Note_staffId",
                table: "Note",
                column: "staffId");

            migrationBuilder.CreateIndex(
                name: "IX_Note_zoneId",
                table: "Note",
                column: "zoneId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteImage_noteId",
                table: "NoteImage",
                column: "noteId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteImage_staffId",
                table: "NoteImage",
                column: "staffId");

            migrationBuilder.CreateIndex(
                name: "IX_Pin_pinTypeId",
                table: "Pin",
                column: "pinTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Pin_planId",
                table: "Pin",
                column: "planId");

            migrationBuilder.CreateIndex(
                name: "IX_Pin_staffId",
                table: "Pin",
                column: "staffId");

            migrationBuilder.CreateIndex(
                name: "IX_Plan_projectId",
                table: "Plan",
                column: "projectId");

            migrationBuilder.CreateIndex(
                name: "IX_Project_companyId",
                table: "Project",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadNotification_notificationId",
                table: "ReadNotification",
                column: "notificationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadNotification_staffId",
                table: "ReadNotification",
                column: "staffId");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_Id",
                table: "Staff",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_departmentId",
                table: "Staff",
                column: "departmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Zone_planId",
                table: "Zone",
                column: "planId");

            migrationBuilder.CreateIndex(
                name: "IX_Zone_zoneTypeId",
                table: "Zone",
                column: "zoneTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ZoneType_projectId",
                table: "ZoneType",
                column: "projectId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Invitation");

            migrationBuilder.DropTable(
                name: "NoteImage");

            migrationBuilder.DropTable(
                name: "Pin");

            migrationBuilder.DropTable(
                name: "ReadNotification");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Note");

            migrationBuilder.DropTable(
                name: "PinType");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "NoteType");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Zone");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "Plan");

            migrationBuilder.DropTable(
                name: "ZoneType");

            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropTable(
                name: "Company");
        }
    }
}
