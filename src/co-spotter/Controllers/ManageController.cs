using System;
using System.IO;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using co_spotter.Data;
using co_spotter.Models;
using Microsoft.AspNetCore.Identity;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace co_spotter.Controllers
{
    [Authorize(Roles = "Manager")]
    public class ManageController : Controller
    {

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHostingEnvironment _environment;

        public ManageController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHostingEnvironment environment)
        {
            _context = context;
            _userManager = userManager;
            _environment = environment;
        }


        [Route("/App/Manage")]
        public IActionResult Index()
        {
            return PartialView("~/Views/App/Manage/Index.cshtml");
        }

        [Route("/App/Manage/Project")]
        public IActionResult Project()
        {
            return PartialView("~/Views/App/Manage/Project/Index.cshtml");
        }

        [Route("/App/Manage/Project/Plan")]
        public IActionResult Plan()
        {
            return PartialView("~/Views/App/Manage/Project/Plan/Index.cshtml");
        }

        [Route("/App/Manage/Project/Department")]
        public IActionResult Department()
        {
            return PartialView("~/Views/App/Manage/Project/Department/Index.cshtml");
        }

        [Route("/App/Manage/Project/ZoneType")]
        public IActionResult ZoneType()
        {
            return PartialView("~/Views/App/Manage/Project/Zone-Type/Index.cshtml");
        }

        [Route("/App/Manage/Project/Staff")]
        public IActionResult Staff()
        {
            return PartialView("~/Views/App/Manage/Project/Staff/Index.cshtml");
        }

        [HttpGet]
        [Route("/App/Manage/Projects/")]
        public JsonResult Projects()
        {

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var projects = _context.project.Where(p => p.companyId == companyId).ToList();

            return Json(new { projects });
        }

        [HttpGet]
        [Route("/App/Manage/GetProject/{project_id}")]
        public JsonResult GetProject(string project_id)
        {

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId & p.projectId == project_id).FirstOrDefault();

            return Json(new { project });
        }

        [HttpPost]
        [Route("/App/Manage/NewProject")]
        public async Task<JsonResult> NewProject()
        {

            string projectName = Request.Form["projectName"].ToString();
            string projectDescription = Request.Form["projectDescription"].ToString();
            string projectStartDate = Request.Form["projectStartDate"].ToString();
            string projectEstimatedFinishtDate = Request.Form["projectEstimatedFinishtDate"].ToString();

            var files = Request.Form.Files;

            if (projectName.Length == 0 || projectStartDate.Length == 0 || projectEstimatedFinishtDate.Length == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            DateTime sDate, eDate;
            if((!(DateTime.TryParse(projectStartDate,out sDate))) || (!(DateTime.TryParse(projectEstimatedFinishtDate,out eDate))) ){
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request: Invalid Date Time" });
            }


            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).First();

            string id = Guid.NewGuid().ToString();
            string dbUrl;
            if (files.Count > 0)
            {
                string serverPath = Path.Combine(new string[] { _environment.WebRootPath, "construction", "project" });
                string dataBasePath = Path.Combine(new string[] { "/", "construction", "project" });
                IFormFile file = files.ElementAt(0);
                if (file.Length <= 0)
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request" });
                }

                string fileServerPath = Path.Combine(serverPath, id);
                if (!Directory.Exists(fileServerPath))
                    Directory.CreateDirectory(fileServerPath);

                string path = Path.Combine(fileServerPath, file.FileName);
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                dbUrl = Path.Combine(dataBasePath, id, file.FileName);

            }
            else
            {
                dbUrl = "/images/project/project-icon.png";
            }

            Project project = new Project
            {
                projectId = id,
                companyId = companyId,
                description = projectDescription,
                name = projectName,
                startDate = sDate,
                estimatedFinishtDate = eDate,
                imgSrc = dbUrl
            };

            _context.project.Add(project);
            _context.SaveChanges();

            Department department = new Department
            {
                departmentId = Guid.NewGuid().ToString(),
                name = "Management",
                projectId = project.projectId
            };

            _context.department.Add(department);
            _context.SaveChanges();

            Staff staff = new Staff
            {
                staffId = Guid.NewGuid().ToString(),
                departmentId = department.departmentId,
                Id = userId
            };

            _context.staff.Add(staff);
            _context.SaveChanges();

            return Json(new { project });
        }

        [HttpPost]
        [Route("/App/Manage/UpdateProject/{projectId}")]
        public async Task<JsonResult> UpdateProject(string projectId)
        {
            string projectName = Request.Form["projectName"].ToString();
            string projectDescription = Request.Form["projectDescription"].ToString();
            string projectStartDate = Request.Form["projectStartDate"].ToString();
            string projectEstimatedFinishtDate = Request.Form["projectEstimatedFinishtDate"].ToString();

            var files = Request.Form.Files;

            if (projectName.Length == 0 || projectStartDate.Length == 0 || projectEstimatedFinishtDate.Length == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            DateTime sDate, eDate;
            if((!(DateTime.TryParse(projectStartDate,out sDate))) || (!(DateTime.TryParse(projectEstimatedFinishtDate,out eDate))) ){
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request: Invalid Date Time" });
            }

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).First();

            var project = _context.project.Where(p => p.projectId == projectId && p.companyId == companyId).FirstOrDefault();
            if (project == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string id = projectId;
            string dbUrl;
            if (files.Count > 0)
            {
                string serverPath = Path.Combine(new string[] { _environment.WebRootPath, "construction", "project" });
                string dataBasePath = Path.Combine(new string[] { "/", "construction", "project" });
                IFormFile file = files.ElementAt(0);
                if (file.Length <= 0)
                {
                    Response.StatusCode = 400;
                    return Json(new { error = "Bad Request" });
                }

                string fileServerPath = Path.Combine(serverPath, id);
                if (!Directory.Exists(fileServerPath))
                    Directory.CreateDirectory(fileServerPath);

                string path = Path.Combine(fileServerPath, file.FileName);
                using (var fileStream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                dbUrl = Path.Combine(dataBasePath, id, file.FileName);

            }
            else
            {
                dbUrl = project.imgSrc;
            }

            project.name = projectName;
            project.description = projectDescription;
            project.startDate = sDate;
            project.estimatedFinishtDate = eDate;
            project.imgSrc = dbUrl;

            _context.SaveChanges();

            return Json(new { project });
        }

        [HttpPost]
        [Route("/App/Manage/Project/Department/{projectId}")]
        public JsonResult Department(string projectId, [FromBody] dynamic req)
        {

            var departments = req.departments;
            if (departments == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var _departments = _context.department.Where(d => d.projectId == projectId).ToList();

            for (int i = 0; i < departments.Count; i++)
            {
                bool flag = true;
                var department = departments[i];
                for (int j = 0; j < _departments.Count; j++)
                {
                    var _department = _departments[j];
                    if (department.name == _department.name)
                    {
                        flag = false;
                        break;
                    }
                }

                if (flag == true)
                {
                    Department newDepartment = new Department { departmentId = Guid.NewGuid().ToString(), name = department.name, projectId = projectId };
                    _context.department.Add(newDepartment);
                    _context.SaveChanges();
                }
            }


            departments = _context.department.Where(d => d.projectId == projectId).ToList();
            return Json(new { departments });
        }

        [HttpGet]
        [Route("/App/Manage/Project/GetDepartments/{projectId}")]
        public JsonResult GetDepartments(string projectId)
        {

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var departments = _context.department.Where(d => d.projectId == projectId).ToList();
            return Json(new { departments });
        }

        [HttpPost]
        [Route("/App/Manage/Project/ZoneType/{projectId}")]
        public JsonResult ZoneType(string projectId, [FromBody] dynamic req)
        {

            var zoneTypes = req.zoneTypes;
            if (zoneTypes == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var _zoneTypes = _context.zoneType.Where(d => d.projectId == projectId).ToList();

            for (int i = 0; i < zoneTypes.Count; i++)
            {
                bool flag = true;
                var zoneType = zoneTypes[i];
                for (int j = 0; j < _zoneTypes.Count; j++)
                {
                    var _zoneType = _zoneTypes[j];
                    if (zoneType.name == _zoneType.name)
                    {
                        flag = false;
                        break;
                    }
                }

                if (flag == true)
                {
                    ZoneType newZoneType = new ZoneType { zoneTypeId = Guid.NewGuid().ToString(), name = zoneType.name, projectId = projectId };
                    _context.zoneType.Add(newZoneType);
                    _context.SaveChanges();
                }
            }


            zoneTypes = _context.zoneType.Where(d => d.projectId == projectId).ToList();
            return Json(new { zoneTypes });
        }

        [HttpGet]
        [Route("/App/Manage/Project/GetZoneTypes/{projectId}")]
        public JsonResult GetZoneTypes(string projectId)
        {

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var zoneTypes = _context.zoneType.Where(d => d.projectId == projectId).ToList();
            return Json(new { zoneTypes });
        }

        [HttpPost]
        [Route("/App/Manage/Project/Plan/{projectId}")]
        public async Task<JsonResult> Plan(string projectId)
        {
            var files = Request.Form.Files;
            if (files == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string serverPath = Path.Combine(new string[] { _environment.WebRootPath, "construction", "plan" });
            string dataBasePath = Path.Combine(new string[] { "/", "construction", "plan" });
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

                    Plan plan = new Plan();
                    plan.planId = id;
                    plan.projectId = projectId;
                    plan.name = Path.GetFileNameWithoutExtension(path);
                    plan.imgSrc = Path.Combine(dataBasePath, id, file.FileName);
                    Bitmap img = new Bitmap(path);
                    plan.width = img.Width;
                    plan.height = img.Height;

                    Size tsize = ResizeKeepAspect(new Size(img.Width, img.Height), 250, 250);

                    Image thumb = img.GetThumbnailImage(tsize.Width, tsize.Height, () => false, IntPtr.Zero);
                    string thumPath = Path.Combine(fileServerPath, "thumb_" + file.FileName);
                    thumb.Save(thumPath);
                    plan.thumbImgSrc = Path.Combine(dataBasePath, id, "thumb_" + file.FileName);
                    plan.active = true;
                    plan.createdAt = DateTime.Now;
                    _context.plan.Add(plan);
                    _context.SaveChanges();
                }
            }

            var plans = _context.plan.Where(p => p.projectId == projectId).ToList();
            return Json(new { plans });
        }


        [HttpGet]
        [Route("/App/Manage/Project/GetPlans/{projectId}")]
        public JsonResult GetPlans(string projectId)
        {
            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var plans = _context.plan.Where(d => d.projectId == projectId).ToList();
            return Json(new { plans });
        }


        [HttpPost]
        [Route("/App/Manage/Project/Staff/{projectId}")]
        public async Task<JsonResult> Staff(string projectId, [FromBody] dynamic req)
        {

            var staffs = req.staffs;
            if (staffs == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).FirstOrDefault();
            if (project == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            for (int i = 0; i < staffs.Count; i++)
            {

                var staff = staffs[i];

                //Check role
                if (staff.role != "Engineer")
                {
                    break;
                }

                string email = staff.email.ToString();

                var user = _context.Users.Where(u => u.Email == email).FirstOrDefault();
                if (user != null)
                {
                    //Double check role
                    if (staff.role == "Engineer")
                    {
                        await _userManager.AddToRoleAsync(user, "Engineer");
                    }

                    Staff _staff = new Staff
                    {
                        staffId = Guid.NewGuid().ToString(),
                        Id = user.Id,
                        departmentId = staff.departmentId
                    };
                    _context.staff.Add(_staff);
                    _context.SaveChanges();

                    continue;
                }

                Invitation inv = new Invitation
                {
                    invitationId = Guid.NewGuid().ToString(),
                    code = Guid.NewGuid().ToString(),
                    departmentId = staff.departmentId,
                    roleId = staff.roleId,
                    email = staff.email,
                    response = false
                };
                _context.invitation.Add(inv);
                _context.SaveChanges();
            }

            var users = _context.staff.Include(s => s.department)
                                        .ThenInclude(d => d.project)
                                      .Include(s => s.user)
                                            .Where(s => s.department.projectId == projectId)
                                            .Select(s => new
                                            {
                                                name = s.user.fullname,
                                                email = s.user.Email,
                                                department = s.department.name,
                                                roleId = s.user.Roles.FirstOrDefault().RoleId
                                            }).ToList();

            var invs = _context.invitation.Include(i => i.department)
                                            .Where(i => i.department.projectId == projectId && i.response == false)
                                            .Select(i => new
                                            {
                                                email = i.email,
                                                department = i.department.name,
                                                roleId = i.roleId
                                            }).ToList();

            return Json(new { invs, users });
        }


        [HttpGet]
        [Route("/App/Manage/Project/GetStaffs/{projectId}")]
        public JsonResult GetStaffs(string projectId)
        {
            string userId = _userManager.GetUserId(User);
            string companyId = _context.Users.Where(u => u.Id == userId).Select(u => u.companyId).FirstOrDefault();

            var project = _context.project.Where(p => p.companyId == companyId && p.projectId == projectId).Count();
            if (project == 0)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request" });
            }

            var departments = _context.department.Where(d => d.projectId == projectId).Select(d => new { value = d.departmentId, content = d.name }).ToList();

            var roles = _context.Roles.Where(r => r.Name != "Admin").Select(r => new { value = r.Id, content = r.Name }).ToList();

            var users = _context.staff.Include(s => s.department)
                                        .ThenInclude(d => d.project)
                                      .Include(s => s.user)
                                            .Where(s => s.department.projectId == projectId)
                                            .Select(s => new
                                            {
                                                name = s.user.fullname,
                                                email = s.user.Email,
                                                department = s.department.name,
                                                roleId = s.user.Roles.FirstOrDefault().RoleId
                                            }).ToList();


            var invs = _context.invitation.Include(i => i.department)
                                            .Where(i => i.department.projectId == projectId && i.response == false)
                                            .Select(i => new
                                            {
                                                email = i.email,
                                                department = i.department.name,
                                                roleId = i.roleId
                                            }).ToList();

            return Json(new { departments, roles, users, invs });
        }

        public static Size ResizeKeepAspect(Size src, int maxWidth, int maxHeight)
        {
            decimal rnd = Math.Min(maxWidth / (decimal)src.Width, maxHeight / (decimal)src.Height);
            return new Size((int)Math.Round(src.Width * rnd), (int)Math.Round(src.Height * rnd));
        }
    }
}