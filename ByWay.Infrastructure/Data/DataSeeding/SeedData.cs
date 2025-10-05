using ByWay.Core.Entities;
using ByWay.Core.Enums;
using Microsoft.AspNetCore.Identity;

namespace ByWay.Infrastructure.Data.DataSeeding
{
    public static class SeedData
    {
        public static async Task Initialize(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Create roles
            var roles = new[] { "Admin", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create admin user
            if (await userManager.FindByEmailAsync("admin@educore.com") == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = "admin@educore.com",
                    Email = "admin@educore.com",
                    FirstName = "Admin",
                    LastName = "educore",
                    IsAdmin = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Seed categories
            if (!context.Categories.Any())
            {
                var categories = new[]
                {
                    new Category { Name = "Fullstack Development", Image = "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Fullstack",Description = "Full-Stack Development",IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Category { Name = "Backend Development", Image = "https://via.placeholder.com/300x200/059669/ffffff?text=Backend",Description = "Back-end web Development",IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Category { Name = "Frontend Development", Image = "https://via.placeholder.com/300x200/dc2626/ffffff?text=Frontend",Description = "Front end web Development",IsActive = true, CreatedAt = DateTime.UtcNow },
                    new Category { Name = "UX/UI Design", Image = "https://via.placeholder.com/300x200/7c3aed/ffffff?text=UI%2FUX",Description = "UIUX",IsActive = true, CreatedAt = DateTime.UtcNow }
                };

                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // Seed instructors
            if (!context.Instructors.Any())
            {
                var instructors = new[]
                {
                    new Instructor
                    {
                        FirstName = "John",
                        LastName = "Smith",
                        Email = "john.smith@byway.com",
                        Bio = "Experienced fullstack developer with 10+ years in the industry",
                        JobTitle = JobTitle.FullstackDeveloper,
                        Image = "https://via.placeholder.com/300x300/4f46e5/ffffff?text=JS",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    },
                    new Instructor
                    {
                        FirstName = "Sarah",
                        LastName = "Johnson",
                        Email = "sarah.johnson@byway.com",
                        Bio = "UI/UX Designer passionate about creating beautiful user experiences",
                        JobTitle = JobTitle.UXUIDesigner,
                        Image = "https://via.placeholder.com/300x300/7c3aed/ffffff?text=SJ",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    },
                    new Instructor
                    {
                        FirstName = "Mike",
                        LastName = "Davis",
                        Email = "mike.davis@byway.com",
                        Bio = "Backend specialist focused on scalable architectures",
                        JobTitle = JobTitle.BackendDeveloper,
                        Image = "https://via.placeholder.com/300x300/059669/ffffff?text=MD",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    },
                    new Instructor
                    {
                        FirstName = "Emily",
                        LastName = "Wilson",
                        Email = "emily.wilson@byway.com",
                        Bio = "Frontend developer expert in React and modern JavaScript",
                        JobTitle = JobTitle.FrontendDeveloper,
                        Image = "https://via.placeholder.com/300x300/dc2626/ffffff?text=EW",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsActive = true
                    }
                };

                context.Instructors.AddRange(instructors);
                await context.SaveChangesAsync();

                // Seed courses
                var categories = context.Categories.ToList();
                var instructorsList = instructors.ToList();

                var courses = new[]
                {
                    new Course
                    {
                        Title = "Complete React Development",
                        Description = "Master React from basics to advanced concepts including hooks, context, and state management",
                        Price = 199.99m,
                        Level = CourseLevel.Intermediate,
                        Rating = 4.8m,
                        Duration = 40,
                        CategoryId = categories.First(c => c.Name == "Frontend Development").Id,
                        InstructorId = instructorsList.First(i => i.JobTitle == JobTitle.FrontendDeveloper).Id,
                        Image = "https://via.placeholder.com/400x250/dc2626/ffffff?text=React+Course",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsPurchased = true,
                        IsPublished = true
                    },
                    new Course
                    {
                        Title = "ASP.NET Core API Development",
                        Description = "Build robust APIs with ASP.NET Core, Entity Framework, and best practices",
                        Price = 249.99m,
                        Level = CourseLevel.Advanced,
                        Rating = 4.9m,
                        Duration = 50,
                        CategoryId = categories.First(c => c.Name == "Backend Development").Id,
                        InstructorId = instructorsList.First(i => i.JobTitle == JobTitle.BackendDeveloper).Id,
                        Image = "https://via.placeholder.com/400x250/059669/ffffff?text=ASP.NET+Course",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsPurchased = true,
                        IsPublished = true
                    },
                    new Course
                    {
                        Title = "Full Stack MERN Development",
                        Description = "Complete web development with MongoDB, Express, React, and Node.js",
                        Price = 299.99m,
                        Level = CourseLevel.Advanced,
                        Rating = 4.7m,
                        Duration = 80,
                        CategoryId = categories.First(c => c.Name == "Fullstack Development").Id,
                        InstructorId = instructorsList.First(i => i.JobTitle == JobTitle.FullstackDeveloper).Id,
                        Image = "https://via.placeholder.com/400x250/4f46e5/ffffff?text=MERN+Stack",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsPurchased = true,
                        IsPublished = true
                    },
                    new Course
                    {
                        Title = "UI/UX Design Fundamentals",
                        Description = "Learn design principles, user research, and prototyping with industry tools",
                        Price = 179.99m,
                        Level = CourseLevel.Beginner,
                        Rating = 4.6m,
                        Duration = 30,
                        CategoryId = categories.First(c => c.Name == "UX/UI Design").Id,
                        InstructorId = instructorsList.First(i => i.JobTitle == JobTitle.UXUIDesigner).Id,
                        Image = "https://via.placeholder.com/400x250/7c3aed/ffffff?text=UI%2FUX+Design",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        IsPurchased = true,
                        IsPublished = true
                    }
                };

                context.Courses.AddRange(courses);
                await context.SaveChangesAsync();
            }
        }
    }
}