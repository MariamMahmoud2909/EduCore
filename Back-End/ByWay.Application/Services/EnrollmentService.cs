using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Enrollment;
using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EnrollmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<EnrollmentDto> EnrollCourseAsync(int userId, int courseId)
        {
            // Check if course exists
            var courses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == courseId);
            if (!courses.Any())
                throw new InvalidOperationException("Course not found");

            // Check if already enrolled
            var existingEnrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.UserId == userId && e.CourseId == courseId
            );

            if (existingEnrollments.Any())
                throw new InvalidOperationException("Already enrolled in this course");

            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow,
                ProgressPercentage = 0,
                IsCompleted = false
            };

            await _unitOfWork.Repository<Enrollment>().AddAsync(enrollment);

            // Log activity
            var course = courses.First();
            await _unitOfWork.Repository<Activity>().AddAsync(new Activity
            {
                Type = "CourseEnrolled",
                Description = $"Enrolled in {course.Title}",
                UserId = userId,
                CourseId = courseId,
                CreatedAt = DateTime.UtcNow
            });

            await _unitOfWork.CompleteAsync();

            return await GetEnrollmentDtoAsync(enrollment.Id) ?? throw new Exception("Failed to create enrollment");
        }

        public async Task<List<EnrollmentDto>> GetUserEnrollmentsAsync(int userId)
        {
            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.UserId == userId,
                query => query
                    .Include(e => e.Course)
                        .ThenInclude(c => c.Instructor)
                    .OrderByDescending(e => e.EnrolledAt)
            );

            return _mapper.Map<List<EnrollmentDto>>(enrollments);
        }

        public async Task<EnrollmentProgressDto?> GetEnrollmentProgressAsync(int userId, int courseId)
        {
            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.UserId == userId && e.CourseId == courseId,
                query => query.Include(e => e.Course)
            );

            var enrollment = enrollments.FirstOrDefault();
            if (enrollment == null)
                return null;

            // Assuming Course has a Lessons collection - you might need to adjust this
            var totalLessons = 10; // Replace with actual lesson count: enrollment.Course.Lessons.Count
            var completedLessons = (int)(totalLessons * (enrollment.ProgressPercentage / 100.0));

            return new EnrollmentProgressDto
            {
                EnrollmentId = enrollment.Id,
                CourseId = enrollment.CourseId,
                CourseTitle = enrollment.Course.Title,
                ProgressPercentage = enrollment.ProgressPercentage,
                CompletedLessons = completedLessons,
                TotalLessons = totalLessons,
                IsCompleted = enrollment.IsCompleted,
                LastAccessedAt = enrollment.LastAccessedAt,
                TimeSpent = TimeSpan.FromHours(0) // Implement time tracking if needed
            };
        }

        public async Task<EnrollmentProgressDto?> UpdateProgressAsync(int userId, int courseId, UpdateProgressDto dto)
        {
            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.UserId == userId && e.CourseId == courseId
            );
            var enrollment = enrollments.FirstOrDefault();

            if (enrollment == null)
                return null;

            enrollment.ProgressPercentage = dto.ProgressPercentage;
            enrollment.LastAccessedAt = DateTime.UtcNow;

            if (dto.IsCompleted.HasValue && dto.IsCompleted.Value && !enrollment.IsCompleted)
            {
                enrollment.IsCompleted = true;
                enrollment.CompletedAt = DateTime.UtcNow;
                enrollment.ProgressPercentage = 100;

                // Log activity
                await _unitOfWork.Repository<Activity>().AddAsync(new Activity
                {
                    Type = "CourseCompleted",
                    Description = $"Completed course",
                    UserId = userId,
                    CourseId = courseId,
                    CreatedAt = DateTime.UtcNow
                });
            }

            _unitOfWork.Repository<Enrollment>().Update(enrollment);
            await _unitOfWork.CompleteAsync();

            return await GetEnrollmentProgressAsync(userId, courseId);
        }

        public async Task<bool> IsUserEnrolledAsync(int userId, int courseId)
        {
            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.UserId == userId && e.CourseId == courseId
            );
            return enrollments.Any();
        }

        private async Task<EnrollmentDto?> GetEnrollmentDtoAsync(int enrollmentId)
        {
            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                e => e.Id == enrollmentId,
                query => query
                    .Include(e => e.Course)
                        .ThenInclude(c => c.Instructor)
            );

            var enrollment = enrollments.FirstOrDefault();
            return enrollment == null ? null : _mapper.Map<EnrollmentDto>(enrollment);
        }
    }
}