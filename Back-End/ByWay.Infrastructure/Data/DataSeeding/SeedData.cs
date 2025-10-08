using ByWay.Core.Entities;
using ByWay.Core.Enums;
using Microsoft.AspNetCore.Identity;

namespace ByWay.Infrastructure.Data.DataSeeding
{
    public static class SeedData
    {
        public static async Task Initialize(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<int>> roleManager)
        {
            await ClearExistingData(context);

            var roles = new[] { "Admin", "Student", "Instructor" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            // Create admin user
            var adminUser = new ApplicationUser
            {
                UserName = "admin@byway.com",
                Email = "admin@byway.com",
                FirstName = "Admin",
                LastName = "One",
                IsAdmin = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            if (await userManager.FindByEmailAsync(adminUser.Email) == null)
            {
                await userManager.CreateAsync(adminUser, "Admin123!");
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // Seed Egyptian students
            var egyptianStudents = new[]
            {
                new { FirstName = "Mohamed", LastName = "Ali", Email = "mohamed.ali@gmail.com" },
                new { FirstName = "Ahmed", LastName = "Lotfy", Email = "ahmed.lotfu@gmail.com" },
                new { FirstName = "Mahmoud", LastName = "Khaled", Email = "mahmoud.khaled@gmail.com" },
                new { FirstName = "Omar", LastName = "Sayed", Email = "omar.sayed@gmail.com" },
                new { FirstName = "Youssef", LastName = "Kamal", Email = "youssef.kamal@gmail.com" },
                new { FirstName = "Hagar", LastName = "Mohamed", Email = "hagar.mohamed@gmail.com" },
                new { FirstName = "Aya", LastName = "Ibrahim", Email = "aya.ibrahim@gmail.com" },
                new { FirstName = "Reem", LastName = "Ahmed", Email = "reem.ahmed@gmail.com" },
                new { FirstName = "Nour", LastName = "Hassan", Email = "nour.hassan@gmail.com" },
                new { FirstName = "Kholoud", LastName = "Khaled", Email = "kholoud.khaled@gmail.com" },
                new { FirstName = "Karim", LastName = "Mahmoud", Email = "karim.mahmoud@gmail.com" },
                new { FirstName = "Amr", LastName = "Selim", Email = "amr.selim@gmail.com" },
                new { FirstName = "Ramy", LastName = "Salem", Email = "ramy.salem@gmail.com" },
                new { FirstName = "Zain", LastName = "Ahmed", Email = "zain.ahmed@gmail.com" },
                new { FirstName = "Laila", LastName = "Fouad", Email = "laila.fouad@gmail.com" }
            };

            var studentUsers = new List<ApplicationUser>();
            foreach (var student in egyptianStudents)
            {
                var user = new ApplicationUser
                {
                    UserName = student.Email,
                    Email = student.Email,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    IsAdmin = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                };

                if (await userManager.FindByEmailAsync(user.Email) == null)
                {
                    await userManager.CreateAsync(user, "Student123!");
                    await userManager.AddToRoleAsync(user, "Student");
                    studentUsers.Add(user);
                }
            }

            // Seed categories
            var categories = new[]
            {
                new Category { Name = "Fullstack Development", Image = "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Fullstack", Description = "Complete web development from frontend to backend", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Backend Development", Image = "https://via.placeholder.com/300x200/059669/ffffff?text=Backend", Description = "Server-side development and APIs", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Frontend Development", Image = "https://via.placeholder.com/300x200/dc2626/ffffff?text=Frontend", Description = "Client-side web development", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "UX/UI Design", Image = "https://via.placeholder.com/300x200/7c3aed/ffffff?text=UI%2FUX", Description = "User experience and interface design", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Artificial Intelligence", Image = "https://via.placeholder.com/300x200/10b981/ffffff?text=AI", Description = "Machine Learning and AI technologies", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Data Science", Image = "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Data+Science", Description = "Data analysis and visualization", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Mobile Development", Image = "https://via.placeholder.com/300x200/ef4444/ffffff?text=Mobile", Description = "iOS and Android app development", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Digital Marketing", Image = "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Marketing", Description = "Online marketing strategies", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Cloud Computing", Image = "https://via.placeholder.com/300x200/06b6d4/ffffff?text=Cloud", Description = "Cloud platforms and services", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Category { Name = "Cybersecurity", Image = "https://via.placeholder.com/300x200/84cc16/ffffff?text=Security", Description = "Information security and ethical hacking", IsActive = true, CreatedAt = DateTime.UtcNow }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            // Seed Egyptian instructors
            var egyptianInstructors = new[]
            {
                new Instructor { FirstName = "Dr. Ahmed", LastName = "Elsayed", Email = "ahmed.elsayed@gmail.com", Bio = "PhD in Computer Science with 15+ years in software development", JobTitle = JobTitle.FullstackDeveloper, Image = "https://via.placeholder.com/300x300/4f46e5/ffffff?text=AE", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Eng. Mohamed", LastName = "Hassan", Email = "mohamed.hassan@gmail.com", Bio = "Senior Backend Engineer specializing in microservices", JobTitle = JobTitle.BackendDeveloper, Image = "https://via.placeholder.com/300x300/059669/ffffff?text=MH", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Sarah", LastName = "Mahmoud", Email = "sarah.mahmoud@gmail.com", Bio = "UI/UX Designer with expertise in modern design systems", JobTitle = JobTitle.UXUIDesigner, Image = "https://via.placeholder.com/300x300/7c3aed/ffffff?text=SM", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Omar", LastName = "Ibrahim", Email = "omar.ibrahim@gmail.com", Bio = "Frontend Architect focusing on React and performance optimization", JobTitle = JobTitle.FrontendDeveloper, Image = "https://via.placeholder.com/300x300/dc2626/ffffff?text=OI", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Dr. Fatma", LastName = "Khalil", Email = "fatma.khalil@gmail.com", Bio = "AI Researcher and Machine Learning expert", JobTitle = JobTitle.AiEngineer, Image = "https://via.placeholder.com/300x300/10b981/ffffff?text=FK", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Karim", LastName = "Nasser", Email = "karim.nasser@gmail.com", Bio = "Data Scientist with expertise in Python and ML algorithms", JobTitle = JobTitle.DataScientist, Image = "https://via.placeholder.com/300x300/f59e0b/ffffff?text=KN", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Mona", LastName = "Farouk", Email = "mona.farouk@gmail.com", Bio = "Mobile Development Lead with Flutter and React Native expertise", JobTitle = JobTitle.MobileDeveloper, Image = "https://via.placeholder.com/300x300/ef4444/ffffff?text=MF", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Hassan", LastName = "Rashad", Email = "hassan.rashad@gmail.com", Bio = "Digital Marketing Strategist and Growth Hacker", JobTitle = JobTitle.MarketingSpecialist, Image = "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=HR", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Amira", LastName = "Salem", Email = "amira.salem@gmail.com", Bio = "Cloud Solutions Architect with AWS and Azure certifications", JobTitle = JobTitle.CloudEngineer, Image = "https://via.placeholder.com/300x300/06b6d4/ffffff?text=AS", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true },
                new Instructor { FirstName = "Ziad", LastName = "Fouad", Email = "ziad.fouad@gmail.com", Bio = "Cybersecurity Expert and Ethical Hacking instructor", JobTitle = JobTitle.SecurityAnalyst, Image = "https://via.placeholder.com/300x300/84cc16/ffffff?text=ZF", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow, IsActive = true }
            };

            context.Instructors.AddRange(egyptianInstructors);
            await context.SaveChangesAsync();

           var courses = new[]
           {
              // Fullstack Development Courses
              new Course
              {
                    Title = "Complete MERN Stack Mastery",
                    Description = "Master MongoDB, Express, React, and Node.js to build modern web applications",
                    Price = 299.99m,
                    Image = "https://via.placeholder.com/400x250/4f46e5/ffffff?text=MERN+Stack",
                    Level = CourseLevel.Advanced,
                    Rating = 4.8m,
                    Duration = 80,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[0].Id,
                    InstructorId = egyptianInstructors[0].Id,
                    AverageRating = 4.8m,
                    ReviewsCount = 25
              },
              new Course
              {
                    Title = "ASP.NET Core Fullstack Development",
                    Description = "Build enterprise applications with ASP.NET Core and React/Angular",
                    Price = 349.99m,
                    Image = "https://via.placeholder.com/400x250/4f46e5/ffffff?text=.NET+Fullstack",
                    Level = CourseLevel.Advanced,
                    Rating = 4.9m,
                    Duration = 70,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[0].Id,
                    InstructorId = egyptianInstructors[0].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 18
                },
              new Course
                {
                    Title = "Python Django Fullstack",
                    Description = "Complete web development with Django and modern frontend frameworks",
                    Price = 279.99m,
                    Image = "https://via.placeholder.com/400x250/4f46e5/ffffff?text=Django+Fullstack",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.7m,
                    Duration = 65,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[0].Id,
                    InstructorId = egyptianInstructors[0].Id,
                    AverageRating = 4.7m,
                    ReviewsCount = 22
                },

              // Backend Development Courses
              new Course
                {
                    Title = "Node.js API Development",
                    Description = "Build scalable RESTful APIs with Node.js, Express, and MongoDB",
                    Price = 199.99m,
                    Image = "https://via.placeholder.com/400x250/059669/ffffff?text=Node.js+API",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.6m,
                    Duration = 45,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[1].Id,
                    InstructorId = egyptianInstructors[1].Id,
                    AverageRating = 4.6m,
                    ReviewsCount = 30
                },
              new Course
                {
                    Title = "Microservices Architecture",
                    Description = "Design and implement microservices with Docker and Kubernetes",
                    Price = 399.99m,
                    Image = "https://via.placeholder.com/400x250/059669/ffffff?text=Microservices",
                    Level = CourseLevel.Advanced,
                    Rating = 4.9m,
                    Duration = 85,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[1].Id,
                    InstructorId = egyptianInstructors[1].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 15
                },
              new Course
                {
                    Title = "Python FastAPI Masterclass",
                    Description = "High-performance APIs with Python FastAPI and modern async patterns",
                    Price = 229.99m,
                    Image = "https://via.placeholder.com/400x250/059669/ffffff?text=FastAPI",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.8m,
                    Duration = 50,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[1].Id,
                    InstructorId = egyptianInstructors[1].Id,
                    AverageRating = 4.8m,
                    ReviewsCount = 20
                },

              // Frontend Development Courses
              new Course
                {
                    Title = "React.js Complete Guide",
                    Description = "From basics to advanced React patterns, hooks, and state management",
                    Price = 189.99m,
                    Image = "https://via.placeholder.com/400x250/dc2626/ffffff?text=React.js",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.7m,
                    Duration = 55,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[2].Id,
                    InstructorId = egyptianInstructors[3].Id,
                    AverageRating = 4.7m,
                    ReviewsCount = 45
                },
              new Course
                {
                    Title = "Vue.js 3 Mastery",
                    Description = "Modern Vue.js 3 with Composition API and ecosystem tools",
                    Price = 179.99m,
                    Image = "https://via.placeholder.com/400x250/dc2626/ffffff?text=Vue.js+3",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.6m,
                    Duration = 48,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[2].Id,
                    InstructorId = egyptianInstructors[3].Id,
                    AverageRating = 4.6m,
                    ReviewsCount = 28
                },
              new Course
                {
                    Title = "Advanced JavaScript Patterns",
                    Description = "Master modern JavaScript, ES6+, and functional programming",
                    Price = 159.99m,
                    Image = "https://via.placeholder.com/400x250/dc2626/ffffff?text=JS+Patterns",
                    Level = CourseLevel.Advanced,
                    Rating = 4.8m,
                    Duration = 40,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[2].Id,
                    InstructorId = egyptianInstructors[3].Id,
                    AverageRating = 4.8m,
                    ReviewsCount = 35
                },

              // AI Courses
              new Course
                {
                    Title = "Machine Learning Fundamentals",
                    Description = "Comprehensive ML course covering algorithms and real-world applications",
                    Price = 449.99m,
                    Image = "https://via.placeholder.com/400x250/10b981/ffffff?text=ML+Fundamentals",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.9m,
                    Duration = 90,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[4].Id,
                    InstructorId = egyptianInstructors[4].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 12
                },
              new Course
                {
                    Title = "Deep Learning with TensorFlow",
                    Description = "Neural networks, CNNs, RNNs, and advanced deep learning techniques",
                    Price = 499.99m,
                    Image = "https://via.placeholder.com/400x250/10b981/ffffff?text=Deep+Learning",
                    Level = CourseLevel.Advanced,
                    Rating = 4.9m,
                    Duration = 100,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[4].Id,
                    InstructorId = egyptianInstructors[4].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 8
                },
              new Course
                {
                    Title = "Natural Language Processing",
                    Description = "Text processing, sentiment analysis, and language models",
                    Price = 399.99m,
                    Image = "https://via.placeholder.com/400x250/10b981/ffffff?text=NLP",
                    Level = CourseLevel.Advanced,
                    Rating = 4.7m,
                    Duration = 75,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[4].Id,
                    InstructorId = egyptianInstructors[4].Id,
                    AverageRating = 4.7m,
                    ReviewsCount = 15
                },

              // Data Science Courses
              new Course
                {
                    Title = "Python for Data Science",
                    Description = "Data analysis, visualization, and manipulation with Python",
                    Price = 279.99m,
                    Image = "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Python+Data",
                    Level = CourseLevel.Beginner,
                    Rating = 4.6m,
                    Duration = 60,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[5].Id,
                    InstructorId = egyptianInstructors[5].Id,
                    AverageRating = 4.6m,
                    ReviewsCount = 40
                },
              new Course
                {
                    Title = "Big Data Analytics",
                    Description = "Handling large datasets with Spark and distributed computing",
                    Price = 429.99m,
                    Image = "https://via.placeholder.com/400x250/f59e0b/ffffff?text=Big+Data",
                    Level = CourseLevel.Advanced,
                    Rating = 4.8m,
                    Duration = 85,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[5].Id,
                    InstructorId = egyptianInstructors[5].Id,
                    AverageRating = 4.8m,
                    ReviewsCount = 18
                },

              // Marketing Courses
              new Course
                {
                    Title = "Digital Marketing Strategy",
                    Description = "Complete digital marketing plan development and execution",
                    Price = 199.99m,
                    Image = "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Digital+Marketing",
                    Level = CourseLevel.Beginner,
                    Rating = 4.5m,
                    Duration = 35,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[7].Id,
                    InstructorId = egyptianInstructors[7].Id,
                    AverageRating = 4.5m,
                    ReviewsCount = 32
                },
              new Course
                {
                    Title = "SEO Mastery 2024",
                    Description = "Search engine optimization techniques for higher rankings",
                    Price = 179.99m,
                    Image = "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=SEO+Mastery",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.7m,
                    Duration = 30,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[7].Id,
                    InstructorId = egyptianInstructors[7].Id,
                    AverageRating = 4.7m,
                    ReviewsCount = 25
                },
              new Course
                {
                    Title = "Social Media Marketing",
                    Description = "Leverage social platforms for business growth and engagement",
                    Price = 159.99m,
                    Image = "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Social+Media",
                    Level = CourseLevel.Beginner,
                    Rating = 4.4m,
                    Duration = 25,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[7].Id,
                    InstructorId = egyptianInstructors[7].Id,
                    AverageRating = 4.4m,
                    ReviewsCount = 38
                },

              // Cloud Computing Courses
              new Course
                {
                    Title = "AWS Solutions Architect",
                    Description = "Design and deploy scalable applications on AWS cloud",
                    Price = 379.99m,
                    Image = "https://via.placeholder.com/400x250/06b6d4/ffffff?text=AWS+Architect",
                    Level = CourseLevel.Advanced,
                    Rating = 4.9m,
                    Duration = 70,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[8].Id,
                    InstructorId = egyptianInstructors[8].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 20
                },
              new Course
                {
                    Title = "Docker & Kubernetes",
                    Description = "Containerization and orchestration for modern applications",
                    Price = 299.99m,
                    Image = "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Docker+K8s",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.8m,
                    Duration = 55,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[8].Id,
                    InstructorId = egyptianInstructors[8].Id,
                    AverageRating = 4.8m,
                    ReviewsCount = 22
                },

              // Cybersecurity Courses
              new Course
                {
                    Title = "Ethical Hacking",
                    Description = "Penetration testing and security assessment techniques",
                    Price = 429.99m,
                    Image = "https://via.placeholder.com/400x250/84cc16/ffffff?text=Ethical+Hacking",
                    Level = CourseLevel.Advanced,
                    Rating = 4.9m,
                    Duration = 80,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[9].Id,
                    InstructorId = egyptianInstructors[9].Id,
                    AverageRating = 4.9m,
                    ReviewsCount = 15
                },
              new Course
                {
                    Title = "Network Security",
                    Description = "Protecting networks from threats and vulnerabilities",
                    Price = 349.99m,
                    Image = "https://via.placeholder.com/400x250/84cc16/ffffff?text=Network+Security",
                    Level = CourseLevel.Intermediate,
                    Rating = 4.7m,
                    Duration = 65,
                    IsPurchased = true,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CategoryId = categories[9].Id,
                    InstructorId = egyptianInstructors[9].Id,
                    AverageRating = 4.7m,
                    ReviewsCount = 18
                }
           };
            
            context.Courses.AddRange(courses);
            await context.SaveChangesAsync();

            // Create some enrollments, orders, and reviews for realistic data
            await CreateSampleEnrollmentsAndOrders(context, studentUsers, courses);
        }

        private static async Task ClearExistingData(ApplicationDbContext context)
        {
            if (context.Enrollments.Any()) context.Enrollments.RemoveRange(context.Enrollments);
            if (context.Reviews.Any()) context.Reviews.RemoveRange(context.Reviews);
            if (context.OrderItems.Any()) context.OrderItems.RemoveRange(context.OrderItems);
            if (context.Orders.Any()) context.Orders.RemoveRange(context.Orders);
            if (context.Carts.Any()) context.Carts.RemoveRange(context.Carts);
            if (context.Courses.Any()) context.Courses.RemoveRange(context.Courses);
            if (context.Instructors.Any()) context.Instructors.RemoveRange(context.Instructors);
            if (context.Categories.Any()) context.Categories.RemoveRange(context.Categories);
            if (context.Payments.Any()) context.Payments.RemoveRange(context.Payments);
            if (context.PaymentMethods.Any()) context.PaymentMethods.RemoveRange(context.PaymentMethods);
            if (context.Activities.Any()) context.Activities.RemoveRange(context.Activities);

            await context.SaveChangesAsync();
        }

        private static async Task CreateSampleEnrollmentsAndOrders(ApplicationDbContext context, List<ApplicationUser> students, Course[] courses)
        {
            var random = new Random();
            var orders = new List<Order>();
            var enrollments = new List<Enrollment>();
            var reviews = new List<Review>();

            foreach (var student in students.Take(10)) // Use first 10 students for sample data
            {
                // Create 1-3 orders per student
                var studentOrders = new List<Order>();
                for (int i = 0; i < random.Next(1, 4); i++)
                {
                    var order = new Order
                    {
                        UserId = student.Id,
                        TotalAmount = 0,
                        Status = OrderStatus.Completed,
                        PaymentMethod = GetRandomPaymentMethod(),
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90)),
                        //CompletedAt = DateTime.UtcNow.AddDays(-random.Next(0, 89))
                    };
                    studentOrders.Add(order);
                }
                context.Orders.AddRange(studentOrders);
                await context.SaveChangesAsync();

                // Add order items and enrollments
                foreach (var order in studentOrders)
                {
                    var courseCount = random.Next(1, 4);
                    var selectedCourses = courses.OrderBy(x => random.Next()).Take(courseCount).ToList();

                    foreach (var course in selectedCourses)
                    {
                        // Order item
                        var orderItem = new OrderItem
                        {
                            OrderId = order.Id,
                            CourseId = course.Id,
                            Price = course.Price
                        };
                        context.OrderItems.Add(orderItem);

                        // Enrollment
                        var enrollment = new Enrollment
                        {
                            UserId = student.Id,
                            CourseId = course.Id,
                            EnrolledAt = order.CreatedAt,
                            ProgressPercentage = (int)(decimal)random.Next(0, 101),
                            IsCompleted = random.Next(0, 2) == 1,
                            LastAccessedAt = DateTime.UtcNow.AddDays(-random.Next(0, 30))
                        };
                        if (enrollment.IsCompleted)
                        {
                            enrollment.CompletedAt = enrollment.EnrolledAt.AddDays(random.Next(10, 60));
                        }
                        enrollments.Add(enrollment);

                        // Review for some courses
                        if (random.Next(0, 2) == 1)
                        {
                            var review = new Review
                            {
                                UserId = student.Id,
                                CourseId = course.Id,
                                Rating = random.Next(3, 6),
                                Comment = GetRandomReviewComment(course.Title),
                                CreatedAt = enrollment.EnrolledAt.AddDays(random.Next(5, 30))
                            };
                            reviews.Add(review);
                        }
                    }

                    // Update order total
                    order.TotalAmount = selectedCourses.Sum(c => c.Price);
                }
            }

            context.Enrollments.AddRange(enrollments);
            context.Reviews.AddRange(reviews);
            await context.SaveChangesAsync();
        }
        private static string GetRandomPaymentMethod()
        {
            var methods = new[] { "CreditCard", "PayPal", "BankTransfer", "Stripe" };
            return methods[new Random().Next(methods.Length)];
        }
        private static string GetRandomReviewComment(string courseTitle)
        {
            var comments = new[]
            {
                $"Excellent course! {courseTitle} was explained very clearly.",
                "Great content and well-structured lessons.",
                "The instructor was very knowledgeable and engaging.",
                $"Practical examples made the concepts of {courseTitle} easy to understand.",
                "Would recommend this course to anyone interested in this field.",
                "Challenging but rewarding course with great support.",
                "The projects helped solidify my understanding.",
                "Perfect balance between theory and practice."
            };
            return comments[new Random().Next(comments.Length)];
        }
    }
}