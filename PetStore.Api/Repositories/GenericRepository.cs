using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PetStore.Api.Data;

namespace PetStore.Api.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly AppDbContext _db;
    private readonly DbSet<T> _set;

    public GenericRepository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public async Task<T?> GetByIdAsync(object id) => await _set.FindAsync(id);
    public IQueryable<T> Query() => _set.AsQueryable();
    public async Task AddAsync(T entity) => await _set.AddAsync(entity);
    public void Update(T entity) => _set.Update(entity);
    public void Remove(T entity) => _set.Remove(entity);
    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate) => await _set.AnyAsync(predicate);
}