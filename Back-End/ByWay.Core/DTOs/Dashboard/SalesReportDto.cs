namespace ByWay.Core.DTOs.Dashboard
{
    public class SalesReportDto
    {
        public string Period { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public List<SalesDataPoint> SalesData { get; set; }
    }

    public class SalesDataPoint
    {
        public string Date { get; set; }
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
    }
}