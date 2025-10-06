using ByWay.Application.Helpers;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.InstructorDto;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IInstructorService
    {
        Task<PagedResult<InstructorDto>> GetInstructorsAsync(InstructorFilterParams filterParams);
        Task<InstructorDto?> GetInstructorByIdAsync(int id);
        Task<InstructorDto> CreateInstructorAsync(CreateInstructorDto instructorDto);
        Task<InstructorDto?> UpdateInstructorAsync(int id, CreateInstructorDto instructorDto);
        Task<bool> DeleteInstructorAsync(int id);
        Task<List<InstructorDto>> GetTopInstructorsAsync(int count = 4);
    }
}