namespace ByWay.Core.DTOs.Common
{
    public class UserFilterParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public bool? IsAdmin { get; set; }
    }
}
