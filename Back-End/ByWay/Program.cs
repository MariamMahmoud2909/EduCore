using ByWay.API.Extensions;
using ByWay.Core.Entities;
using ByWay.Infrastructure.Data;
using ByWay.Infrastructure.Data.DataSeeding;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;

namespace ByWay.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddAuthServices(builder.Configuration);
            builder.Services.AddApplicationsService(builder.Configuration);
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ByWay", Version = "v1" });
                c.UseInlineDefinitionsForEnums();
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Production",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });

                options.AddPolicy("Development",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            IdentityModelEventSource.ShowPII = true;

            var app = builder.Build();

            // Swagger configuration
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ByWay API V1");
                c.RoutePrefix = "swagger";
            });

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseCors("Development");
            }
            else
            {
                app.UseCors("Production");
            }

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.Use(async (context, next) =>
            {
                context.Request.EnableBuffering();
                await next();
            });

            app.UseStaticFiles();

            var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "images");

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(imagesPath),
                RequestPath = "/images"
            });

            app.UseRouting();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            try
            {
                using (var scope = app.Services.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
                    await SeedData.Initialize(context, userManager, roleManager);
                }
            }
            catch (Exception ex)
            {
                var logger = app.Services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Database seeding failed");
            }

            app.Run();
        }
    }
}