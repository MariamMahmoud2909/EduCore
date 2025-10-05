using ByWay.Core.DTOs.Category;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<List<CategoryDto>> GetTopCategoriesAsync(int count = 4);
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
    }
}
