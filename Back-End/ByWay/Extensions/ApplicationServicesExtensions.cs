using ByWay.Application.Helpers;
using ByWay.Application.Services;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.Entities;
using ByWay.Core.Mappings;
using ByWay.Infrastructure.Data;
using ByWay.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ByWay.API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationsService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers(); 
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped(typeof(IUnitOfWork), typeof(UnitOfWork));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IInstructorService, InstructorService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IEnrollmentService, EnrollmentService>();

            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            return services;
        }

        public static IServiceCollection AddAuthServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());
            services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
            })
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders()
                    .AddRoles<IdentityRole<int>>();
            services.AddHttpClient();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                    .AddJwtBearer(options =>
                        {
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidateAudience = true,
                                ValidateLifetime = true,
                                ValidateIssuerSigningKey = true,
                                ValidIssuer = configuration["Jwt:Issuer"],
                                ValidAudience = configuration["Jwt:Audience"],
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
                                RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
                                ClockSkew = TimeSpan.Zero

                            };

                            options.Events = new JwtBearerEvents
                            {
                                OnMessageReceived = context =>
                                {
                                    var token = context.Token;
                                    Console.WriteLine($"Received token: {token}");
                                    Console.WriteLine($"Token length: {token?.Length}");
                                    return Task.CompletedTask;
                                },
                                OnAuthenticationFailed = context =>
                                {
                                    Console.WriteLine($"Authentication Failed: {context.Exception}");
                                    Console.WriteLine($"Exception Details: {context.Exception.StackTrace}");
                                    return Task.CompletedTask;
                                }
                            };
                        })
                    .AddGoogle(options =>
                    {
                        options.ClientId = configuration["Authentication:Google:ClientId"];
                        options.ClientSecret = configuration["Authentication:Google:ClientSecret"];
                        options.CallbackPath = "/api/auth/external-callback";
                        options.SaveTokens = true;

                        // Map additional claims
                        options.ClaimActions.MapJsonKey("picture", "picture");
                        options.ClaimActions.MapJsonKey("email_verified", "email_verified");
                    })
                    .AddFacebook(options =>
                    {
                        options.AppId = configuration["Authentication:Facebook:AppId"];
                        options.AppSecret = configuration["Authentication:Facebook:AppSecret"];
                        options.CallbackPath = "/api/auth/external-callback";
                        options.SaveTokens = true;

                        // Request additional fields
                        options.Fields.Add("picture");
                        options.Fields.Add("email");
                    })
                    .AddGitHub(options =>
                    {
                        options.ClientId = configuration["Authentication:GitHub:ClientId"];
                        options.ClientSecret = configuration["Authentication:GitHub:ClientSecret"];
                        options.CallbackPath = "/api/auth/external-callback";
                        options.SaveTokens = true;
                        options.Scope.Add("user:email");
                    });

            return services;
        }
    }
}
