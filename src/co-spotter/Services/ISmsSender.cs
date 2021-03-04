using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace co_spotter.Services
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
