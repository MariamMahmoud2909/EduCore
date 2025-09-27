
using ByWay.Core.Contracts.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace ByWay.Core.Entities
{
    public class ApplicationUser : IdentityUser, ITimestampEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsAdmin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Cart> ShoppingCarts { get; set; } = new List<Cart>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

        public string FullName => $"{FirstName} {LastName}";
    }
}
