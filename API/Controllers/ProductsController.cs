using API.Data;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : BaseApiController
    {

        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(string orderBy,string searchTerm)
        {
            var query = _context.Products
            .Sort(orderBy)
            .Search(searchTerm)
            .AsQueryable(); //AsQueryable yaptık çünkü metotlar this ile IQueryable<Product> alıyor.

            
            
            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProducts(int id)
        {
            var product= await _context.Products.FindAsync(id);

            if(product==null) return NotFound();

            return product;
        }

    }
}