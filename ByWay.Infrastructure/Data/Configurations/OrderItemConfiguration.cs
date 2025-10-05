using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Infrastructure.Data.Configurations
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // Table configuration
            builder.ToTable("OrderItems");
            builder.HasKey(oi => oi.Id);

            // Properties configuration
            builder.Property(oi => oi.Id)
                .ValueGeneratedOnAdd();

            builder.Property(oi => oi.Price)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(oi => oi.PurchasedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            builder.HasIndex(oi => oi.OrderId)
                .HasDatabaseName("IX_OrderItems_OrderId");

            builder.HasIndex(oi => oi.CourseId)
                .HasDatabaseName("IX_OrderItems_CourseId");

            builder.HasIndex(oi => new { oi.OrderId, oi.CourseId })
                .IsUnique()
                .HasDatabaseName("IX_OrderItems_Order_Course");

            builder.HasIndex(oi => oi.PurchasedAt)
                .HasDatabaseName("IX_OrderItems_PurchasedAt");

            // Relationships are configured in Order and Course configurations
        }
    }
}
