
namespace ByWay.Core.Contracts.Interfaces
{
    public interface ITimestampEntity
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}
