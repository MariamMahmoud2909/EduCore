using AutoMapper;
using ByWay.Core.DTOs.Category;
using ByWay.Core.DTOs.Course;
using ByWay.Core.DTOs.InstructorDto;
using ByWay.Core.DTOs.Order;
using ByWay.Core.DTOs.User;
using ByWay.Core.Entities;

namespace ByWay.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Course, CourseDto>().ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name)).ForMember(dest => dest.InstructorName, opt => opt.MapFrom(src => $"{src.Instructor.FirstName} {src.Instructor.LastName}"));
            CreateMap<CreateCourseDto, Course>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Instructor, InstructorDto>();
            CreateMap<CreateInstructorDto, Instructor>();
            CreateMap<Order, OrderDto>().ForMember(dest => dest.Courses, opt => opt.MapFrom(src => src.OrderItems.Select(oi => oi.Course)));
            CreateMap<ApplicationUser, UserDto>().ForMember(dest => dest.OrdersCount, opt => opt.MapFrom(src => src.Orders.Count)).ForMember(dest => dest.TotalSpent, opt => opt.MapFrom(src => src.Orders.Sum(o => o.TotalAmount)));
        }
    }
}
