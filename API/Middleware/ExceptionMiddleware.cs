using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> logger,IHostEnvironment env)
        {
            this._next = next;
            this._logger = logger;
            this._env = env;
        }
        //bunu çağırdık çünkü middleware oluşturuyoruz ve her middleware'de Invoke methodu zorunludur.
        public async Task InvokeAsync(HttpContext context){
            try
            {
                await _next(context); //bunun amacı birden fazla middleware olduğu için hata yoksa bir sonraki middleware geçirmek
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,ex.Message);
                context.Response.ContentType="application/json";
                context.Response.StatusCode = 500;

                var response=new ProblemDetails{
                    Status=500,
                    Detail=_env.IsDevelopment() ? ex.StackTrace?.ToString() : null, //ex.StackTrace:hata oluşurken hangi yolun izlendiği hangi metodların çağırıldığı ve hatanın nerde oluştuğu ile ilgili bilgiler verir
                    Title=ex.Message,
                };

                var options=new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};

                var json=JsonSerializer.Serialize(response,options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}