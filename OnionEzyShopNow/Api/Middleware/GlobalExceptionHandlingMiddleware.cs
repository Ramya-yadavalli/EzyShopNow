using System.Net;
namespace Api.Middleware
{
   public class GlobalExceptionHandlingMiddleware
        {
            private readonly RequestDelegate _next;
            private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

            public GlobalExceptionHandlingMiddleware(
                RequestDelegate next,
                ILogger<GlobalExceptionHandlingMiddleware> logger)
            {
                _next = next;
                _logger = logger;
            }

            public async Task InvokeAsync(HttpContext context)
            {
                try
                {
                    await _next(context);
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Unhandled exception occurred. Method: {Method}, Path: {Path}",
                        context.Request.Method,
                        context.Request.Path
                    );

                    context.Response.Clear();

                    context.Response.StatusCode =
                        (int)HttpStatusCode.InternalServerError;

                    context.Response.ContentType = "application/json";

                    await context.Response.WriteAsJsonAsync(new
                    {
                        statusCode = 500,
                        message = "An unexpected error occurred."
                    });
                }
            }
        }
    }
