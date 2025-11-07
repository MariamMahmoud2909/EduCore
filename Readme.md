**ByWay — E-Learning Platform**

ByWay is a Full-stack E-learning Platform designed to deliver a complete online learning experience for both students and administrators. Built with ASP.NET Core and React.js, it combines clean backend architecture, real-time interactivity, and a polished user experience to simulate a professional learning management system.

**Overview**

The platform provides a full learning lifecycle — from course discovery to enrollment, purchase, and progress tracking — all under a secure and responsive interface.
Users can explore available courses, view instructor profiles, and manage their learning journey, while administrators can oversee content, monitor platform performance, and manage users through an intuitive dashboard.
ByWay was developed with scalability, maintainability, and clean architecture in mind, making it suitable both as a standalone LMS and as a foundation for larger education-based solutions.

**System Architecture & Design**

ByWay follows Clean Architecture and the Repository and Unit of Work pattern, ensuring separation of concerns and long-term maintainability.

**Backend (ASP.NET Core)**

- Follows a layered structure: Core → Application → Infrastructure → API
- Built using Entity Framework Core with SQL Server
- Implements JWT authentication and role-based authorization
- Uses AutoMapper for DTO mapping and service abstraction
- Includes real SMTP integration for transactional emails

**Frontend (React)**

- Built with React + Vite for performance and modularity
- State management handled by Jotai
- Page transitions and animations via Framer Motion
- Responsive UI built with Bootstrap 5 and a custom design system
- Admin interface includes tables, analytics, and management modals
- The frontend communicates with backend APIs via a centralized Axios service for cleaner state synchronization and API calls.

**Setup & Run Locally**

1. Clone the repository

```git clone https://github.com/MariamMahmoud2909/EduCore.git```

2. Backend Setup

  Open the solution in Visual Studio.
  Update appsettings.json:
```
"ConnectionStrings": {
  "DefaultConnection": "your_connection_string"
},
"Token": {
  "Key": "super_secret_key_here",
  "Issuer": "ByWayApp"
},
"EmailSettings": {
  "Host": "smtp.gmail.com",
  "Port": 587,
  "Email": "your_email@gmail.com",
  "Password": "your_app_password"
}
```

  Apply migrations:

```
update-database
dotnet run
```

3. Frontend Setup
```
cd edu-core
npm install
npm run dev
```

4. Visit:
  Backend: https://localhost:5149
  Frontend: http://localhost:3000
  
5. Live Front URL: https://educore-marketly.netlify.app/

6. Live Swagger Documentation: https://mariam2909-001-site1.anytempurl.com/swagger/index.html
