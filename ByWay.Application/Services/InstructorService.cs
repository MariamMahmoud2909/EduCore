
using AutoMapper;
using ByWay.Application.Helpers;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.InstructorDto;
using ByWay.Core.Entities;

namespace ByWay.Application.Services
{
    public class InstructorService : IInstructorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public InstructorService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<InstructorDto>> GetInstructorsAsync(InstructorFilterParams filterParams)
        {
            var instructors = await _unitOfWork.Repository<Instructor>().GetAllAsync();

            // Apply filters
            var filteredInstructors = instructors.AsQueryable();

            if (!string.IsNullOrEmpty(filterParams.Search))
            {
                filteredInstructors = filteredInstructors.Where(i =>
                    i.FirstName.Contains(filterParams.Search, StringComparison.OrdinalIgnoreCase) ||
                    i.LastName.Contains(filterParams.Search, StringComparison.OrdinalIgnoreCase));
            }

            if (filterParams.JobTitle.HasValue)
                filteredInstructors = filteredInstructors.Where(i => i.JobTitle == filterParams.JobTitle.Value);

            var totalCount = filteredInstructors.Count();

            // Apply pagination
            var pagedInstructors = filteredInstructors
                .OrderByDescending(i => i.CreatedAt)
                .Skip((filterParams.Page - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToList();

            var instructorDtos = _mapper.Map<List<InstructorDto>>(pagedInstructors);

            return new PagedResult<InstructorDto>
            {
                Items = instructorDtos,
                TotalCount = totalCount,
                Page = filterParams.Page,
                PageSize = filterParams.PageSize
            };
        }

        public async Task<InstructorDto?> GetInstructorByIdAsync(int id)
        {
            var instructors = await _unitOfWork.Repository<Instructor>().FindAsync(i => i.Id == id);
            var instructor = instructors.FirstOrDefault();
            return instructor == null ? null : _mapper.Map<InstructorDto>(instructor);
        }

        public async Task<InstructorDto> CreateInstructorAsync(CreateInstructorDto instructorDto)
        {
            var instructor = _mapper.Map<Instructor>(instructorDto);
            instructor.CreatedAt = DateTime.UtcNow;
            instructor.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Repository<Instructor>().AddAsync(instructor);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<InstructorDto>(instructor);
        }

        public async Task<InstructorDto?> UpdateInstructorAsync(int id, CreateInstructorDto instructorDto)
        {
            var instructors = await _unitOfWork.Repository<Instructor>().FindAsync(i => i.Id == id);
            var instructor = instructors.FirstOrDefault();

            if (instructor == null)
                return null;

            _mapper.Map(instructorDto, instructor);
            instructor.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Repository<Instructor>().Update(instructor);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<InstructorDto>(instructor);
        }

        public async Task<bool> DeleteInstructorAsync(int id)
        {
            var instructors = await _unitOfWork.Repository<Instructor>().FindAsync(i => i.Id == id);
            var instructor = instructors.FirstOrDefault();

            if (instructor == null)
                return false;

            // Check if instructor has courses
            var hasCourses = await _unitOfWork.Repository<Course>().AnyAsync(c => c.InstructorId == id);

            if (hasCourses)
                return false;

            _unitOfWork.Repository<Instructor>().Delete(instructor);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<List<InstructorDto>> GetTopInstructorsAsync(int count = 4)
        {
            var instructors = await _unitOfWork.Repository<Instructor>().GetAllAsync(
                query => query.OrderByDescending(i => i.CreatedAt).Take(count)
            );

            return _mapper.Map<List<InstructorDto>>(instructors);
        }
    }
}