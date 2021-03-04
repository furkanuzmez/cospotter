using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using WebSocketManager;

namespace CoreWS.App_Code
{
    public class ConstructionMessageHandler : WebSocketHandler
    {
        public ConstructionMessageHandler(WebSocketConnectionManager webSocketConnectionManager) : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);

            var socketId = WebSocketConnectionManager.GetId(socket);

            WebSocketManager.Common.Message message = new WebSocketManager.Common.Message();
            message.Data = $"{socketId} is now connected";
            message.MessageType = WebSocketManager.Common.MessageType.ConnectionEvent;

            await SendMessageToAllAsync(message);
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);

            WebSocketManager.Common.Message message = new WebSocketManager.Common.Message();

            message.Data = Encoding.UTF8.GetString(buffer, 0, result.Count);
            message.MessageType = WebSocketManager.Common.MessageType.Text;

            await SendMessageToAllAsync(message);
        }
    }
}
