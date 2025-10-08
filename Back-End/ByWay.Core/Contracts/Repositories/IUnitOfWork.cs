namespace ByWay.Core.Contracts.Repositories
{
    public interface IUnitOfWork :  IAsyncDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;
        Task<int> CompleteAsync();
    }
}
