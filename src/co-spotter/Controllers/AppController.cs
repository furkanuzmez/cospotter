using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using co_spotter.Services;
using co_spotter.Models;
using Microsoft.Extensions.Logging;
using co_spotter.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace co_spotter.Controllers
{

    [Authorize]
    public class AppController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly IHostingEnvironment _environment;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;

        public AppController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext context,
            IHostingEnvironment environment,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _environment = environment;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AppController>();
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Construction()
        {
            return PartialView("~/Views/App/Construction/Index.cshtml");
        }

        public IActionResult PlanNavigation()
        {
            return PartialView("~/Views/App/Construction/PlanNavigation.cshtml");
        }

        public IActionResult NoteNavigation()
        {
            return PartialView("~/Views/App/Construction/NoteNavigation.cshtml");
        }

        public IActionResult ZoneNotes()
        {
            return PartialView("~/Views/App/Construction/ZoneNotes.cshtml");
        }

        public JsonResult GetPlan(string id)
        {

            //User ID
            string userId = _userManager.GetUserId(User);

            //Plan
            var plan = _context.plan.Where(p => p.planId == id)
                                              .Select(p => new
                                              {
                                                  planId = p.planId,
                                                  name = p.name,
                                                  imgSrc = p.imgSrc,
                                                  projectId = p.projectId,
                                                  width = p.width,
                                                  height = p.height,
                                                  thumbImgSrc = p.thumbImgSrc
                                              }).FirstOrDefault();

            //Marker-Zone of Plans
            var zones = _context.zone.Where(z => z.planId == plan.planId).Select(z => new { id = z.zoneId, name = z.name, x = z.coordX, y = z.coordY, zoneType = z.zoneTypeId, }).ToList();

            //Pins of Plans
            var pins = _context.pin.Where(p => p.planId == plan.planId).Select(p => new { id = p.pinId, content = p.content, x = p.coordX, y = p.coordY, type = "pin" }).ToList();


            //Departments of Project
            var departments = _context.department.Where(d => d.projectId == plan.projectId).Select(d => new { departmentId = d.departmentId, name = d.name }).ToList();

            //ZoneTypes of Project
            var zoneTypes = _context.zoneType.Where(z => z.projectId == plan.projectId).Select(z => new { value = z.zoneTypeId, content = z.name }).ToList();

            //Is the users work on this project?
            var staff = _context.staff.Include(s => s.department)
                                        .ThenInclude(s => s.project)
                                        .Where(s => s.department.projectId == plan.projectId && s.Id == userId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            return Json(new { plan, markers = zones, pins, departments, zoneTypes });

        }

        [HttpGet]
        [Route("/App/Construction/GetProjectPlans/{planId}")]
        public JsonResult GetProjectPlans(string planId)
        {

            string userId = _userManager.GetUserId(User);

            var plan = _context.plan.Where(p => p.planId == planId).FirstOrDefault();
            if (plan == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var staff = _context.staff.Include(s => s.department.project).Where(s => s.Id == userId && s.department.project.projectId == plan.projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var plans = _context.plan.Where(p => p.projectId == plan.projectId).Select(p => new { planId = p.planId, name = p.name, thumbImgSrc = p.thumbImgSrc }).ToList();

            return Json(new { plans });

        }

        [HttpPost]
        [Route("/App/Construction/NewNote/{zoneId}")]
        public async Task<JsonResult> NewNote(string zoneId)
        {
            string userId = _userManager.GetUserId(User);

            string content = Request.Form["noteContent"].ToString();
            string noteTypeId = Request.Form["noteType"].ToString();
            string dateTime = Request.Form["dateTime"].ToString();

            var files = Request.Form.Files;


            var zone = _context.zone.Where(z => z.zoneId == zoneId)
                                    .Select(z => new
                                    {
                                        zoneId = z.zoneId,
                                        projectId = z.zoneType.project.projectId,
                                        zoneName = z.name,
                                        planName = z.plan.name
                                    }).FirstOrDefault();



            var staff = _context.staff.Where(s => s.Id == userId && s.department.project.projectId == zone.projectId).Include(s => s.department.project).Include(s => s.user).FirstOrDefault();

            if (staff == null)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }


            DateTime date;
            if (!(DateTime.TryParse(dateTime, out date)))
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request: Invalid Date Time" });
            }

            Note note = new Note
            {

                noteId = Guid.NewGuid().ToString(),
                content = content,
                noteTypeId = noteTypeId,
                zoneId = zoneId,
                createdAt = DateTime.Now,
                staffId = staff.staffId
            };

            _context.note.Add(note);
            _context.SaveChanges();

            string imgSrcList = "";

            string serverPath = Path.Combine(new string[] { _environment.WebRootPath, "construction", "noteimage" });
            string dataBasePath = Path.Combine(new string[] { "/", "construction", "noteimage" });

            for (int i = 0; i < files.Count; i++)
            {
                IFormFile file = files.ElementAt(i);
                if (file.Length > 0)
                {
                    string id = Guid.NewGuid().ToString();

                    string fileServerPath = Path.Combine(serverPath, id);
                    if (!Directory.Exists(fileServerPath))
                        Directory.CreateDirectory(fileServerPath);

                    string path = Path.Combine(fileServerPath, file.FileName);
                    using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                    NoteImage noteImage = new NoteImage
                    {
                        noteImageId = id,
                        noteId = note.noteId,
                        staffId = staff.staffId,
                        imgSrc = Path.Combine(dataBasePath, id, file.FileName)
                    };
                    _context.noteImage.Add(noteImage);
                    _context.SaveChanges();

                    imgSrcList += "<img style=\"width: 100%; margin: .5em auto; border: solid 2px rgba(0, 0, 0, .1)\" src=\"http://cospotter.com/" + noteImage.imgSrc + "\"/>";
                }
            }


            var users = _context.staff.Where(s => s.department.project.projectId == zone.projectId)
                                                        .Select(s => new
                                                        {
                                                            fullname = s.user.fullname,
                                                            email = s.user.Email
                                                        }).ToList();

            var noteType = _context.noteType.Where(z => z.noteTypeId == noteTypeId).FirstOrDefault();

            string subject = "Notification from - " + staff.department.project.name;
            string body = "<div style=\"font-family: inherit; padding: 1em\"><h3 style=\"margin: .5em 0\">"
                + zone.planName + " - " + zone.zoneName + " - " + noteType.name + "</h3><p style=\"line-height: 1.5em; margin: 0 0 .5em 0\">"
                + note.content
                + "</p><h5 style=\"margin: .5em 0; line-height: 1.5em\">By <label style=\"background-color: #eee; padding: .15em .5em; border-radius: 2px\">"
                + /*USER INFO*/ staff.user.fullname + " - " + staff.user.Email + "</label> from <label style=\"background-color: #eee; padding: .15em .5em; border-radius: 2px\">"
                + /*DEPARTMENT*/ staff.department.name + " </label></h5><div>"
                + /*IMG LIST-- <img style=\"width: 30%; margin: 0 auto; border: solid 2px rgba(0, 0, 0, .1)\" src=\"1.png\"/> --*/ imgSrcList + "</div></div>"
                + "<div><a style=\"font-size:3em; text-decoration:none; display:flex; align-content:center; align-items:center\" href=\"http://cospotter.com/app\"><img src=\"http://cospotter.com/images/icons/Cospotter.png\"/><h2>Cospotter</h2></a></div>";

            _emailSender.SendEmailAsync(users, subject, body);

            var notes = _context.note
                        .Include(n => n.staff.user)
                        .Where(n => n.zoneId == zoneId)
                            .Select(n => new
                            {
                                noteType = n.noteType.name,
                                content = n.content,
                                createdAt = n.createdAt,
                                username = n.staff.user.Email,
                                noteImages = _context.noteImage.Where(nm => nm.noteId == n.noteId).Select(nm => new { src = nm.imgSrc }).ToList()
                            }).ToList();

            return Json(new { notes });
        }

        [HttpGet]
        [Route("/App/Construction/DeleteNote/{noteId}")]
        public async Task<JsonResult> DeleteNote(string noteId)
        {
            //string userId = _userManager.GetUserId(User);
            var user = await _userManager.GetUserAsync(User);

            bool userRole = await _userManager.IsInRoleAsync(user, "Admin");
            if (userRole == false)
                userRole = await _userManager.IsInRoleAsync(user, "Manager");

            if (userRole == true)
            {
                var note = _context.note.Where(n => n.noteId == noteId).FirstOrDefault();
                if (note == null)
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request" });
                }

                var noteImages = _context.noteImage.Where(n => n.noteId == note.noteId).ToList();
                foreach (var noteImage in noteImages)
                {
                    _context.Remove(noteImage);
                    _context.SaveChanges();
                }

                _context.Remove(note);
                _context.SaveChanges();

                return Json(new { message = "Deleted" });

            }
            else
            {
                var note = _context.note.Where(n => n.staff.user.Id == user.Id && n.noteId == noteId).FirstOrDefault();
                if (note == null)
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request" });
                }

                var noteImages = _context.noteImage.Where(n => n.noteId == note.noteId).ToList();
                foreach (var noteImage in noteImages)
                {
                    _context.Remove(noteImage);
                    _context.SaveChanges();
                }

                _context.Remove(note);
                _context.SaveChanges();

                return Json(new { message = "Deleted" });
            }
        }

        [HttpGet]
        [Route("/App/Construction/GetNotes/{zoneId}")]
        public JsonResult GetNotes(string zoneId)
        {

            string userId = _userManager.GetUserId(User);

            var _zone = _context.zone.Where(z => z.zoneId == zoneId).Select(z => new { projectId = z.zoneType.project.projectId }).FirstOrDefault();
            if (_zone == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var staff = _context.staff.Include(s => s.department)
                                        .ThenInclude(s => s.project)
                                        .Include(s => s.user)
                                            .Where(s => s.user.Id == userId && s.department.project.projectId == _zone.projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var _notes = _context.note.Include(n => n.zone.zoneType.project).Where(n => n.zone.zoneType.project.projectId == staff.department.project.projectId).ToList();

            if (_notes == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var notes = _context.note
                        .Include(n => n.staff.user)
                        .Where(n => n.zoneId == zoneId)
                            .Select(n => new
                            {
                                heading = "HEAD",
                                noteId = n.noteId,
                                noteType = n.noteType.name,
                                content = n.content,
                                createdAt = n.createdAt,
                                username = n.staff.user.Email,
                                noteImages = _context.noteImage.Where(nm => nm.noteId == n.noteId).Select(nm => new { src = nm.imgSrc }).ToList()
                            }).ToList();
            

            return Json(new { notes });
        }

        [HttpGet]
        [Route("/App/Construction/GetNoteCount/{projectId}")]
        public JsonResult GetNoteCount(string projectId)
        {
            var _notes = _context.note.Include(n => n.zone.zoneType.project).Where(n => n.zone.zoneType.projectId == projectId).Count();

            return Json(new { _notes });
        }

        [HttpGet]
        [Route("/App/Construction/GetLastNote/{projectId}")]
        public JsonResult GetLastNote(string projectId)
        {
            var lastNote = _context.note.Include(n => n.zone.zoneType.project).Where(n => n.zone.zoneType.projectId == projectId).OrderBy(n => n.createdAt).Last();

            var noteType = _context.noteType.Where(nt => nt.noteTypeId == lastNote.noteTypeId).FirstOrDefault();

            var plan = _context.plan.Where(p => p.planId == lastNote.zone.planId).FirstOrDefault();

            return Json(new { lastNote, noteType, plan });
        }

        [HttpGet]
        [Route("/App/Construction/GetNoteTypes")]
        public JsonResult GetNoteTypes()
        {

            var noteTypes = _context.noteType.Select(n => new { value = n.noteTypeId, content = n.name }).ToList();

            return Json(new { noteTypes });
        }

        [HttpGet]
        [Route("/App/Construction/GetPlanNotes/{planId}")]
        public JsonResult GetPlanNotes(string planId)
        {

            string userId = _userManager.GetUserId(User);
            var plan = _context.plan.Where(p => p.planId == planId).FirstOrDefault();
            if (plan == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var staff = _context.staff.Include(s => s.department.project).Where(s => s.Id == userId && s.department.project.projectId == plan.projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var notes = _context.note.Where(n => n.zone.plan.planId == plan.planId)
                                    .Select(n => new
                                    {
                                        content = n.content,
                                        user = n.staff.user.Email,
                                        createdAt = n.createdAt,
                                        zoneId = n.zone.zoneId,
                                        zoneName = n.zone.name,
                                        zoneTypeId = n.zone.zoneType.zoneTypeId,
                                        zoneTypeName = n.zone.zoneType.name,
                                        planId = n.zone.plan.planId,
                                        planName = n.zone.plan.name
                                    }).ToList();
            return Json(new { notes });

        }


        [HttpPost]
        [Route("/App/Construction/NewMarker/{planId}")]
        public JsonResult NewMarker(string planId, [FromBody] dynamic req)
        {
            var marker = req.marker;
            var data = req.data;

            if (marker == null || data == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string userId = _userManager.GetUserId(User);

            var plan = _context.plan.Where(p => p.planId == planId).FirstOrDefault();

            if (plan == null)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var staff = _context.staff.Include(s => s.department)
                                        .Include(s => s.department.project)
                                        .Where(s => s.Id == userId && s.department.project.projectId == plan.projectId).FirstOrDefault();

            if (staff == null)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }


            Zone z = new Zone
            {
                zoneId = Guid.NewGuid().ToString(),
                name = data.zoneName,
                zoneTypeId = data.zoneType,
                coordX = marker.pos.x,
                coordY = marker.pos.y,
                createdAt = DateTime.Now,
                planId = planId
            };

            _context.zone.Add(z);
            _context.SaveChanges();

            return Json(new { marker = new { id = z.zoneId, type = "red", pos = new { x = z.coordX, y = z.coordY }, planId = planId } });
        }

        [HttpPost]
        [Route("/App/Construction/NewPin/{planId}")]
        public async Task<JsonResult> NewPin(string planId)
        {
            string coordX = Request.Form["coordX"].ToString();
            string coordY = Request.Form["coordY"].ToString();

            var files = Request.Form.Files;

            if (files == null || files.Count != 1)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }


            string userId = _userManager.GetUserId(User);

            var plan = _context.plan.Where(p => p.planId == planId).FirstOrDefault();

            if (plan == null)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var staff = _context.staff.Include(s => s.department)
                                        .Include(s => s.department.project)
                                        .Where(s => s.Id == userId && s.department.project.projectId == plan.projectId).FirstOrDefault();

            if (staff == null)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string serverPath = Path.Combine(new string[] { _environment.WebRootPath, "construction", "pin" });
            string dataBasePath = Path.Combine(new string[] { "/", "construction", "pin" });
            IFormFile file = files.ElementAt(0);
            if (file.Length <= 0)
            {

                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string id = Guid.NewGuid().ToString();

            string fileServerPath = Path.Combine(serverPath, id);
            if (!Directory.Exists(fileServerPath))
                Directory.CreateDirectory(fileServerPath);

            string path = Path.Combine(fileServerPath, file.FileName);
            using (var fileStream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            Pin pin = new Pin
            {
                pinId = id,
                content = Path.Combine(dataBasePath, id, file.FileName),
                pinTypeId = null,
                coordX = int.Parse(coordX),
                coordY = int.Parse(coordY),
                createdAt = DateTime.Now,
                planId = planId,
                staffId = staff.staffId

            };


            _context.pin.Add(pin);
            _context.SaveChanges();

            return Json(new { marker = new { id = pin.pinId, type = "pin", pos = new { x = pin.coordX, y = pin.coordY }, planId = planId } });

        }

        [HttpGet]
        [Route("/App/Construction/GetPin/{pinId}")]
        public JsonResult GetPin(string pinId)
        {

            string userId = _userManager.GetUserId(User);

            var _pin = _context.pin.Where(p => p.pinId == pinId).Select(p => new { projectId = p.plan.project.projectId }).FirstOrDefault();

            var staff = _context.staff.Where(s => s.user.Id == userId && s.department.project.projectId == _pin.projectId).FirstOrDefault();

            if (staff == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var pin = _context.pin.Where(p => p.pinId == pinId)
                                    .Select(p => new
                                    {
                                        pinId = p.pinId,
                                        content = p.content,
                                        user = p.staff.user.Email,
                                        planId = p.plan.planId,
                                        planName = p.plan.name
                                    }).FirstOrDefault();

            if (pin == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            return Json(new { pin });

        }

        [HttpGet]
        [Route("/App/Construction/GetDate")]
        public JsonResult GetDate()
        {
            _emailSender.SendEmailAsync("oktaykirik@gmail.com", "Notification", "hello my friend");



            return Json(new { DateTime.Now });

        }
    }
}
