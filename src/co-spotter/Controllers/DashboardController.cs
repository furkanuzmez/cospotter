using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using co_spotter.Data;
using co_spotter.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace co_spotter.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return PartialView("~/Views/App/Dashboard/Index.cshtml");
        }
        public IActionResult Plans()
        {
            return PartialView("~/Views/App/Dashboard/Plans.cshtml");
        }
        public IActionResult All()
        {
            return PartialView("~/Views/App/Dashboard/All.cshtml");
        }
        public IActionResult Notes()
        {
            return PartialView("~/Views/App/Dashboard/Notes.cshtml");
        }
        public IActionResult Images()
        {
            return PartialView("~/Views/App/Dashboard/Images.cshtml");
        }

        [HttpGet]
        [Route("/Dashboard/GetProjects")]
        public JsonResult GetProjects()
        {
            //User ID
            string userId = _userManager.GetUserId(User);

            //All projects of the user
            var projects = _context.staff.Where(s => s.Id == userId)
                                         .Select(s => new
                                         {
                                             projectId = s.department.project.projectId,
                                             projectName = s.department.project.name,
                                             projectImgSrc = s.department.project.imgSrc,
                                             projectDesc = s.department.project.description,
                                             departmentId = s.department.departmentId,
                                             departmentName = s.department.name
                                         });

            return Json(new { projects });
        }

        [HttpGet]
        [Route("/Dashboard/GetProject/{projectId}")]
        public JsonResult GetProject(string projectId)
        {

            //User ID
            string userId = _userManager.GetUserId(User);

            var staff = _context.staff.Where(s => s.user.Id == userId && s.department.project.projectId == projectId)
                                       .Select(s => new
                                       {
                                           projectId = s.department.project.projectId,
                                           projectName = s.department.project.name,
                                           departmentId = s.department.departmentId,
                                           departmentName = s.department.name
                                       }).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            //Pre-defined note-types
            var noteTypes = _context.noteType.ToList();

            return Json(new { staff, noteTypes });
        }

        [HttpGet]
        [Route("/Dashboard/GetProjectPlans/{projectId}")]
        public JsonResult GetProjectPlans(string projectId)
        {

            //User ID
            string userId = _userManager.GetUserId(User);

            var staff = _context.staff.Where(s => s.user.Id == userId && s.department.project.projectId == projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            //Plans of the project
            var plans = _context.plan.Where(p => p.project.projectId == projectId)
                                     .Select(p => new
                                     {
                                         planId = p.planId,
                                         name = p.name,
                                         thumbImgSrc = p.thumbImgSrc,
                                         src = p.imgSrc,
                                     });

            return Json(new { plans });
        }

        [HttpGet]
        [Route("/Dashboard/GetProjectNotes/{projectId}/{dateTime}/{noteType}")]
        public JsonResult GetProjectNotes(string projectId, string dateTime, string noteType)
        {
            //User ID
            string userId = _userManager.GetUserId(User);

            var staff = _context.staff.Where(s => s.user.Id == userId && s.department.project.projectId == projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }


            if (dateTime == "All" && noteType == "all")
            {
                var notes = _context.note.Where(n => n.zone.plan.project.projectId == projectId)
                     .Select(n => new
                     {
                         noteId = n.noteId,
                         content = n.content,
                         noteTypeId = n.noteType.noteTypeId,
                         noteTypeName = n.noteType.name,
                         user = n.staff.user.Email,
                         createdAt = n.createdAt,
                         departmentId = n.staff.department.departmentId,
                         departmentName = n.staff.department.name,
                         zoneId = n.zone.zoneId,
                         zoneName = n.zone.name,
                         zoneTypeId = n.zone.zoneType.zoneTypeId,
                         zoneType = n.zone.zoneType.name,
                         planId = n.zone.plan.planId,
                         planName = n.zone.plan.name,
                         noteImages = _context.noteImage.Where(ni => ni.noteId == n.noteId).Select(ni => new { src = ni.imgSrc }).ToList()
                     }).ToList();

                return Json(new { notes });

            }
            else if (dateTime == "All" && noteType != "all")
            {

                var notes = _context.note.Where(n => n.zone.plan.project.projectId == projectId && n.noteType.name == noteType)
                                     .Select(n => new
                                     {
                                         noteId = n.noteId,
                                         content = n.content,
                                         noteTypeId = n.noteType.noteTypeId,
                                         noteTypeName = n.noteType.name,
                                         user = n.staff.user.Email,
                                         createdAt = n.createdAt,
                                         departmentId = n.staff.department.departmentId,
                                         departmentName = n.staff.department.name,
                                         zoneId = n.zone.zoneId,
                                         zoneName = n.zone.name,
                                         zoneTypeId = n.zone.zoneType.zoneTypeId,
                                         zoneType = n.zone.zoneType.name,
                                         planId = n.zone.plan.planId,
                                         planName = n.zone.plan.name,
                                         noteImages = _context.noteImage.Where(ni => ni.noteId == n.noteId).Select(ni => new { src = ni.imgSrc }).ToList()
                                     }).ToList();

                return Json(new { notes });

            }
            else if (dateTime != "All" && noteType == "all")
            {
                DateTime date;
                if (!(DateTime.TryParse(dateTime, out date)))
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request: Invalid Date Time" });
                }

                var notes = _context.note.Where(n => n.zone.plan.project.projectId == projectId)
                                     .Select(n => new
                                     {
                                         noteId = n.noteId,
                                         content = n.content,
                                         noteTypeId = n.noteType.noteTypeId,
                                         noteTypeName = n.noteType.name,
                                         user = n.staff.user.Email,
                                         createdAt = n.createdAt,
                                         departmentId = n.staff.department.departmentId,
                                         departmentName = n.staff.department.name,
                                         zoneId = n.zone.zoneId,
                                         zoneName = n.zone.name,
                                         zoneTypeId = n.zone.zoneType.zoneTypeId,
                                         zoneType = n.zone.zoneType.name,
                                         planId = n.zone.plan.planId,
                                         planName = n.zone.plan.name,
                                         noteImages = _context.noteImage.Where(ni => ni.noteId == n.noteId).Select(ni => new { src = ni.imgSrc }).ToList()
                                     }).Where(n => n.createdAt.Year == date.Year && n.createdAt.Month == date.Month && n.createdAt.Day == date.Day).ToList();
                return Json(new { notes });
            }
            else if (dateTime != "All" && noteType != "all")
            {

                DateTime date;
                if (!(DateTime.TryParse(dateTime, out date)))
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request: Invalid Date Time" });
                }

                var notes = _context.note.Where(n => n.zone.plan.project.projectId == projectId && n.noteType.name == noteType)
                                     .Select(n => new
                                     {
                                         noteId = n.noteId,
                                         content = n.content,
                                         noteTypeId = n.noteType.noteTypeId,
                                         noteTypeName = n.noteType.name,
                                         user = n.staff.user.Email,
                                         createdAt = n.createdAt,
                                         departmentId = n.staff.department.departmentId,
                                         departmentName = n.staff.department.name,
                                         zoneId = n.zone.zoneId,
                                         zoneName = n.zone.name,
                                         zoneTypeId = n.zone.zoneType.zoneTypeId,
                                         zoneType = n.zone.zoneType.name,
                                         planId = n.zone.plan.planId,
                                         planName = n.zone.plan.name,
                                         noteImages = _context.noteImage.Where(ni => ni.noteId == n.noteId).Select(ni => new { src = ni.imgSrc }).ToList()
                                     }).Where(n => n.createdAt.Year == date.Year && n.createdAt.Month == date.Month && n.createdAt.Day == date.Day).ToList();
                return Json(new { notes });
            }
            else
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request: Invalid Date Time or Type" });
            }
        }

        [HttpGet]
        [Route("/Dashboard/GetProjectImages/{projectId}/{dateTime}")]
        public JsonResult GetProjectImages(string projectId, string dateTime)
        {
            //User ID
            string userId = _userManager.GetUserId(User);

            var staff = _context.staff.Where(s => s.user.Id == userId && s.department.project.projectId == projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            if (dateTime == "All")
            {

                var noteImages = _context.noteImage.Where(n => n.note.zone.zoneType.project.projectId == projectId)
                                                    .Select(n => new
                                                    {
                                                        noteId = n.noteId,
                                                        //note = n.note,
                                                        title = n.note.noteType.name,
                                                        src = n.imgSrc,
                                                        user = n.staff.user.Email,
                                                        zoneId = n.note.zone.zoneId,
                                                        zoneName = n.note.zone.name,
                                                        planId = n.note.zone.plan.planId,
                                                        planName = n.note.zone.plan.name,
                                                    }).ToList();


                var pins = _context.pin.Where(p => p.plan.project.projectId == projectId)
                                        .Select(p => new
                                        {

                                            pinId = p.pinId,
                                            src = p.content,
                                            planId = p.plan.planId,
                                            planName = p.plan.name
                                        }).ToList();

                return Json(new { noteImages, pins });

            }
            else
            {

                DateTime date;
                if (!(DateTime.TryParse(dateTime, out date)))
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request: Invalid Date Time" });
                }

                var noteImages = _context.noteImage.Where(n => n.note.zone.zoneType.project.projectId == projectId)
                                                    .Select(n => new
                                                    {
                                                        noteId = n.noteId,
                                                        //note = n.note,
                                                        title = n.note.noteType.name,
                                                        src = n.imgSrc,
                                                        user = n.staff.user.Email,
                                                        zoneId = n.note.zone.zoneId,
                                                        zoneName = n.note.zone.name,
                                                        planId = n.note.zone.plan.planId,
                                                        planName = n.note.zone.plan.name,
                                                        createdAt = n.note.createdAt
                                                    }).ToList();


                noteImages = noteImages.Where(nc => nc.createdAt.Year == date.Year && nc.createdAt.Month == date.Month && nc.createdAt.Day == date.Day).ToList();


                var pins = _context.pin.Where(p => p.plan.project.projectId == projectId && p.createdAt.Year == date.Year && p.createdAt.Month == date.Month && p.createdAt.Day == date.Day)
                        .Select(p => new
                        {

                            pinId = p.pinId,
                            src = p.content,
                            planId = p.plan.planId,
                            planName = p.plan.name
                        }).ToList();

                return Json(new { noteImages, pins });
            }

        }
    }
}