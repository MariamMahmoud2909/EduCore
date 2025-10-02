using AutoMapper;
using ByWay.Application.Services;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.Entities;
using ByWay.Core.Mappings;
using ByWay.Infrastructure.Data;
using ByWay.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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

            //services.AddSingleton(new MapperConfiguration(cfg =>
            //{
            //    cfg.AddProfile(new MappingProfile());
            //}).CreateMapper());
            //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            return services;
        }

        public static IServiceCollection AddAuthServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
            })
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders();
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
                                RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                            };
                        });
            return services;
        }
    }
}
