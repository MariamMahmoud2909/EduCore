using AutoMapper;
using ByWay.Application.DTOs.CourseDto;
using ByWay.Application.DTOs.InstructorDto;
using ByWay.Core.Entities;

namespace ByWay.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Course, CourseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.InstructorName, opt => opt.MapFrom(src => $"{src.Instructor.FirstName} {src.Instructor.LastName}"));

            CreateMap<CreateCourseDto, Course>();

            CreateMap<Instructor, InstructorDto>();
            CreateMap<CreateInstructorDto, Instructor>();
        }
    }
}
