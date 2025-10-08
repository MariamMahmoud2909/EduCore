////using ByWay.API.Extensions;
////using ByWay.Core.Entities;
////using ByWay.Infrastructure.Data;
////using ByWay.Infrastructure.Data.DataSeeding;
////using Microsoft.AspNetCore.HttpOverrides;
////using Microsoft.AspNetCore.Identity;
////using Microsoft.Extensions.FileProviders;
////using Microsoft.IdentityModel.Logging;
////using Microsoft.OpenApi.Models;

////namespace ByWay.API
////{
////    public class Program
////    {
////        public static async Task Main(string[] args)
////        {
////            var builder = WebApplication.CreateBuilder(args);

////            // Add services to the container.
////            builder.Services.AddAuthServices(builder.Configuration);
////            builder.Services.AddApplicationsService(builder.Configuration);
////            builder.Services.AddEndpointsApiExplorer();
////            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
////            builder.Services.AddOpenApi();
////            builder.Services.AddSwaggerGen(c =>
////            {
////                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ByWay", Version = "v1" });
////                c.UseInlineDefinitionsForEnums();
////                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
////                {
////                    Name = "Authorization",
////                    Type = SecuritySchemeType.ApiKey,
////                    Scheme = "Bearer",
////                    BearerFormat = "JWT",
////                    In = ParameterLocation.Header,
////                    Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
////                });
////                c.AddSecurityRequirement(new OpenApiSecurityRequirement
////                {
////                    {
////                        new OpenApiSecurityScheme
////                        {
////                            Reference = new OpenApiReference
////                            {
////                                Type = ReferenceType.SecurityScheme,
////                                Id = "Bearer"
////                            }
////                        },
////                        Array.Empty<string>()
////                    }
////                });
////            });

////            builder.Services.AddCors(options =>
////            {
////                options.AddPolicy("Production",
////                    policy =>
////                    {
////                        policy.WithOrigins(
////                            "https://algoriza-internship2025-fs172-fe-by.vercel.app",
////                            "http://mariam2909-001-site1.anytempurl.com"
////                        )
////                        .AllowAnyHeader()
////                        .AllowAnyMethod()
////                        .AllowCredentials();
////                    });

////                options.AddPolicy("Development",
////                    policy =>
////                    {
////                        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
////                              .AllowAnyHeader()
////                              .AllowAnyMethod()
////                              .AllowCredentials();
////                    });
////            });


////            IdentityModelEventSource.ShowPII = true;

////            var app = builder.Build();

////            if (app.Environment.IsDevelopment())
////            {
////                app.MapOpenApi();
////                app.UseCors("Development");
////            }

////            app.UseSwagger();
////            app.UseSwaggerUI(c =>
////            {
////                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ByWay API V1");
////                c.RoutePrefix = "api/docs";
////            });

////            if (!app.Environment.IsDevelopment())
////            {
////                app.UseExceptionHandler("/Error");
////                app.UseHsts();
////                app.UseCors("Production");
////            }

////            app.UseExceptionHandler(errorApp =>
////            {
////                errorApp.Run(async context =>
////                {
////                    context.Response.StatusCode = 500;
////                    var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();

////                    if (exceptionHandlerPathFeature?.Error != null)
////                    {
////                        var logger = app.Services.GetRequiredService<ILogger<Program>>();
////                        logger.LogError(exceptionHandlerPathFeature.Error, "Unhandled exception occurred.");
////                    }
////                });
////            });

////            app.Use(async (context, next) =>
////            {
////                context.Request.EnableBuffering();
////                await next();
////            });

////            app.UseRouting();

////            // Debug: Check what directories exist
////            var currentDir = Directory.GetCurrentDirectory();
////            var wwwrootPath = Path.Combine(currentDir, "wwwroot");
////            var uploadsPath = Path.Combine(wwwrootPath, "uploads");

////            Console.WriteLine($"Current Directory: {currentDir}");
////            Console.WriteLine($"wwwroot exists: {Directory.Exists(wwwrootPath)}");
////            Console.WriteLine($"uploads exists: {Directory.Exists(uploadsPath)}");

////            app.UseStaticFiles();

////            if (Directory.Exists(uploadsPath))
////            {
////                app.UseStaticFiles(new StaticFileOptions
////                {
////                    FileProvider = new PhysicalFileProvider(uploadsPath),
////                    RequestPath = "/uploads"
////                });
////            }

////            app.UseForwardedHeaders(new ForwardedHeadersOptions
////            {
////                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
////            });

////            app.UseHttpsRedirection();

////            app.UseAuthentication();

////            app.UseAuthorization();

////            app.UseEndpoints(endpoints =>
////            {
////                endpoints.MapControllers();
////            });

////            using (var scope = app.Services.CreateScope())
////            {
////                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
////                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
////                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
////                await SeedData.Initialize(context, userManager, roleManager);
////            }

////            app.Run();
////        }
////    }
////}
//using ByWay.API.Extensions;
//using ByWay.Core.Entities;
//using ByWay.Infrastructure.Data;
//using ByWay.Infrastructure.Data.DataSeeding;
//using Microsoft.AspNetCore.HttpOverrides;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.Extensions.FileProviders;
//using Microsoft.IdentityModel.Logging;
//using Microsoft.OpenApi.Models;

//namespace ByWay.API
//{
//    public class Program
//    {
//        public static async Task Main(string[] args)
//        {
//            var builder = WebApplication.CreateBuilder(args);

//            // Add services to the container.
//            builder.Services.AddAuthServices(builder.Configuration);
//            builder.Services.AddApplicationsService(builder.Configuration);
//            builder.Services.AddEndpointsApiExplorer();
//            builder.Services.AddOpenApi();
//            builder.Services.AddSwaggerGen(c =>
//            {
//                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ByWay", Version = "v1" });
//                c.UseInlineDefinitionsForEnums();
//                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//                {
//                    Name = "Authorization",
//                    Type = SecuritySchemeType.ApiKey,
//                    Scheme = "Bearer",
//                    BearerFormat = "JWT",
//                    In = ParameterLocation.Header,
//                    Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
//                });
//                c.AddSecurityRequirement(new OpenApiSecurityRequirement
//                {
//                    {
//                        new OpenApiSecurityScheme
//                        {
//                            Reference = new OpenApiReference
//                            {
//                                Type = ReferenceType.SecurityScheme,
//                                Id = "Bearer"
//                            }
//                        },
//                        Array.Empty<string>()
//                    }
//                });
//            });

//            builder.Services.AddCors(options =>
//            {
//                options.AddPolicy("Production",
//                    policy =>
//                    {
//                        policy.WithOrigins(
//                            "https://algoriza-internship2025-fs172-fe-byway-pu1jmgg3w.vercel.app",
//                            "https://mariam2909-001-site1.anytempurl.com"
//                        )
//                        .AllowAnyHeader()
//                        .AllowAnyMethod()
//                        .AllowCredentials();
//                    });

//                options.AddPolicy("Development",
//                    policy =>
//                    {
//                        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
//                              .AllowAnyHeader()
//                              .AllowAnyMethod()
//                              .AllowCredentials();
//                    });
//            });

//            IdentityModelEventSource.ShowPII = true;

//            var app = builder.Build();

//            // Environment configuration
//            if (app.Environment.IsDevelopment())
//            {
//                app.MapOpenApi();
//                app.UseCors("Development");
//            }
//            else
//            {
//                app.UseExceptionHandler("/Error");
//                app.UseHsts();
//                app.UseCors("Production");
//            }

//            app.UseSwagger();
//            app.UseSwaggerUI(c =>
//            {
//                c.SwaggerEndpoint("/swagger/v1/swagger.json", "ByWay API V1");
//                c.RoutePrefix = "swagger";
//            });

//            app.Use(async (context, next) =>
//            {
//                context.Request.EnableBuffering();
//                await next();
//            });

//            app.UseRouting();
//            app.UseStaticFiles();
//            app.UseForwardedHeaders(new ForwardedHeadersOptions
//            {
//                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
//            });
//            app.UseHttpsRedirection();
//            app.UseAuthentication();
//            app.UseAuthorization();
//            app.MapControllers();

//            // Test endpoint
//            app.MapGet("/", () => "ByWay API is running!");

//            // Safe database seeding
//            try
//            {
//                using (var scope = app.Services.CreateScope())
//                {
//                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//                    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
//                    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
//                    await SeedData.Initialize(context, userManager, roleManager);
//                }
//            }
//            catch (Exception ex)
//            {
//                var logger = app.Services.GetRequiredService<ILogger<Program>>();
//                logger.LogError(ex, "Database seeding failed");
//            }

//            app.Run();
//        }
//    }
//}
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
                        policy.WithOrigins(
                            "https://algoriza-internship2025-fs172-fe-byway-8zux01fxz.vercel.app",
                            "https://mariam2909-001-site1.anytempurl.com"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
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

            // CORS MUST come BEFORE UseRouting
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseCors("Development");
            }
            else
            {
                app.UseCors("Production");
            }

            // Exception handling
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

            // Routing and other middleware
            app.UseRouting();
            app.UseStaticFiles();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            // Test endpoint
            app.MapGet("/", () => "ByWay API is running!");

            // Safe database seeding
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