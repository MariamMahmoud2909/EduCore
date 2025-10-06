using ByWay.Core.Enums;

namespace ByWay.Application.Helpers
{
    public class InstructorFilterParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public JobTitle? JobTitle { get; set; }
    }
}
