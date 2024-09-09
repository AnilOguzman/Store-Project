using API.Data;
using API.Dtos;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("[controller]")]
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket=await RetrieveBasket();
         
            if (basket == null) return NotFound();

            return new BasketDto{
                Id=basket.Id,
                BuyerId=basket.BuyerId,
                Items=basket.Items.Select(item=>new BasketItemDto{
                    ProductId=item.ProductId,
                    Name=item.Product.Name,
                    Price=item.Product.Price,
                    PictureUrl=item.Product.PictureUrl,
                    Type=item.Product.Type,
                    Brand=item.Product.Brand,
                    Quantity=item.Quantity
                }).ToList()
            };
        }

        [HttpPost]  //bunlar gerçekleşirken productId ve quantity değişkenlerini urlden query string olarak alır.
        public async Task<ActionResult> AddItemToBasket(int productId,int quantity)
        {
            var basket=await RetrieveBasket();
            if(basket==null) basket=CreateBasket();
            var product= await _context.Products.FindAsync(productId);
            if(product==null) return NotFound();
            basket.AddItem(product,quantity);
           
            var result=await _context.SaveChangesAsync() > 0 ;
            if(result) return StatusCode(201); 

            return BadRequest(new ProblemDetails{Title="Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId,int quantity)
        {
           var basket= await RetrieveBasket();
           if(basket==null) return NotFound();

           basket.RemoveItem(productId,quantity);
           
           var result= await _context.SaveChangesAsync() > 0;
           if(result) return Ok();
           return BadRequest(new ProblemDetails{Title="Problem removing item from the basket"});
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
            
        }

        private Basket CreateBasket()
        {
            var buyerId=Guid.NewGuid().ToString(); //Globally using identifier oluşturduk yani çakışması imkansız bir buyerId oluşturduk bunu cookiede tutacağız
            var cookieOptions=new CookieOptions{IsEssential=true,Expires=DateTime.Now.AddDays(30)};//IsEssential'ı true yaptık çünkü bazı bilgileri cookiede tutacağız bu yüzden zorunlu kıldık
            Response.Cookies.Append("buyerId",buyerId, cookieOptions);//cookie'de buyerId tutacağımızı belirttik ve optionsları verdik
            var basket=new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
    }
}