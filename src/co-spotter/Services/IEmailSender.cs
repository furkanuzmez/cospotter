using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace co_spotter.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(dynamic users, string subject, string message);
    }
}
