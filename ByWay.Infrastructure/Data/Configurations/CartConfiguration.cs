
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ByWay.Core.Entities;

namespace ByWay.Infrastructure.Data.Configurations
{
    public class CartConfiguration : IEntityTypeConfiguration<Cart>
    {
        public void Configure(EntityTypeBuilder<Cart> builder)
        {
            // Table configuration
            builder.ToTable("Carts");
            builder.HasKey(sc => sc.Id);

            // Properties configuration
            builder.Property(sc => sc.Id)
                .ValueGeneratedOnAdd();

            builder.Property(sc => sc.UserId)
                .HasMaxLength(450)
                .IsRequired();

            builder.Property(sc => sc.AddedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            builder.HasIndex(sc => new { sc.UserId, sc.CourseId })
                .IsUnique()
                .HasDatabaseName("IX_ShoppingCarts_User_Course");

            builder.HasIndex(sc => sc.UserId)
                .HasDatabaseName("IX_ShoppingCarts_UserId");

            builder.HasIndex(sc => sc.CourseId)
                .HasDatabaseName("IX_ShoppingCarts_CourseId");

            builder.HasIndex(sc => sc.AddedAt)
                .HasDatabaseName("IX_ShoppingCarts_AddedAt");
        }
    }
}
