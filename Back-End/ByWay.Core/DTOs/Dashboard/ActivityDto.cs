namespace ByWay.Core.DTOs.Dashboard
{
    public class ActivityDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string UserName { get; set; }
        public string CourseName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}