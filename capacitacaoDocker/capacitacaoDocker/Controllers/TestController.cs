using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace capacitacaoDocker.Controllers
{
    [ApiController]
    [Route("test")]
    public class TestController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpGet()]
        [Route("ws")]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                _logger.Log(LogLevel.Information, "WebSocket connection established");
                await Echo(webSocket);
            }
            else
            {
                _logger.Log(LogLevel.Information, "WebSocket connection established");
                HttpContext.Response.StatusCode = 400;
            }
        }

        private async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[256];
            var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

            _logger.Log(LogLevel.Information, "Message received from Client");

            while (!result.CloseStatus.HasValue)
            {
                string stringBuffer = Encoding.UTF8.GetString(buffer);
                int index = stringBuffer.IndexOf('\0');
                if(index >= 0)
                {
                    stringBuffer = stringBuffer.Remove(index);
                }

                // TODO se for salvar no banco tem que pegar esse msgJson
                _logger.Log(LogLevel.Information, stringBuffer);
                var msgJson = JsonSerializer.Deserialize<MessageFormat>(stringBuffer);

                await Task.Delay(1000);

                var serverMsg = Encoding.UTF8.GetBytes(convertMessage(msgJson.message));

                await webSocket.SendAsync(new ArraySegment<byte>(serverMsg, 0, serverMsg.Length), result.MessageType, result.EndOfMessage, CancellationToken.None);

                buffer = new byte[256];

                result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);
                _logger.Log(LogLevel.Information, "Message received from Client");

            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            _logger.Log(LogLevel.Information, "WebSocket connection closed");
        }

        private string convertMessage(string message)
        {
            var sendMessage = new MessageFormat();
            sendMessage.message = message.ToUpper();
            var date = DateTime.Now;
            sendMessage.date = date;
            sendMessage.type = "return";
            return JsonSerializer.Serialize<MessageFormat>(sendMessage);
        }

    }

    public class MessageFormat
    {
        public string message { get; set; }
        public DateTime date { get; set; }

        public string type { get; set;}
    }
}