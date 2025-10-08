using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using ByWay.Core.Enums;

namespace ByWay.Infrastructure.Data.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // Table configuration
            builder.ToTable("Orders");
            builder.HasKey(o => o.Id);

            // Properties configuration
            builder.Property(o => o.Id)
                .ValueGeneratedOnAdd();

            builder.Property(o => o.UserId)
                .HasMaxLength(450)
                .IsRequired();

            builder.Property(o => o.TotalAmount)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(o => o.TaxAmount)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(o => o.PaymentMethod)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(o => o.PaymentTransactionId)
                .HasMaxLength(100);

            builder.Property(o => o.Status)
                .HasConversion<int>()
                .HasDefaultValue(OrderStatus.Pending);

            builder.Property(o => o.OrderDate)
                .HasDefaultValueSql("GETUTCDATE()");

            // Billing Information
            builder.Property(o => o.BillingFirstName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(o => o.BillingLastName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(o => o.BillingEmail)
                .HasMaxLength(256)
                .IsRequired();

            builder.Property(o => o.BillingAddress)
                .HasMaxLength(500)
                .IsRequired();

            builder.Property(o => o.BillingCity)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(o => o.BillingZipCode)
                .HasMaxLength(20)
                .IsRequired();

            // Indexes
            builder.HasIndex(o => o.UserId)
                .HasDatabaseName("IX_Orders_UserId");

            builder.HasIndex(o => o.OrderDate)
                .HasDatabaseName("IX_Orders_OrderDate");

            builder.HasIndex(o => o.Status)
                .HasDatabaseName("IX_Orders_Status");

            builder.HasIndex(o => o.PaymentTransactionId)
                .HasDatabaseName("IX_Orders_PaymentTransactionId");

            // Relationships
            builder.HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}