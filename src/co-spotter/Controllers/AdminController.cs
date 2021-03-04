using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using co_spotter.Data;
using Microsoft.AspNetCore.Identity;
using co_spotter.Models;
using Microsoft.AspNetCore.Authorization;

namespace co_spotter.Controllers
{

    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult RegisterCompany()
        {
            return View();
        }

        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        [HttpPost]
        public async Task<JsonResult> registerNewCompany([FromBody] dynamic req)
        {

            if (req.company.name == null ||
                req.company.email == null ||
                req.company.phone == null ||
                /* company.logo == null ||*/
                req.company.website == null ||
                req.manager.fullname == null ||
                req.manager.email == null ||
                req.manager.password == null)
            {
                Response.StatusCode = 400;
                return Json(new { error = "Bad Request!" });
            }

            string logoImgSrc = "default/logo.png";

            Company company = new Company
            {
                companyId = Guid.NewGuid().ToString(),
                name = req.company.name,
                email = req.company.email,
                phone = req.company.phone,
                website = req.company.website,
                address = req.company.address,
                logoImgSrc = logoImgSrc,
                createdAt = DateTime.Now,
                active = true
            };

            _context.company.Add(company);
            _context.SaveChanges();

            string userEmail = req.manager.email;
            string userName = req.manager.fullname;
            string userPassword = req.manager.password;

            var user = new ApplicationUser { UserName = userEmail, Email = userEmail, companyId = company.companyId };
            var result = await _userManager.CreateAsync(user, userPassword);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Manager");
                return Json(new { company, user });
            }
            else
            {
                Response.StatusCode = 400;
                return Json(new { error = "User Can Not Created!", company.companyId });
            }

        }
    }
}