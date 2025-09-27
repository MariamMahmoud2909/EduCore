using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Infrastructure.Data.Configurations
{
    public class CourseConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            // Table configuration
            builder.ToTable("Courses");
            builder.HasKey(c => c.Id);

            // Properties configuration
            builder.Property(c => c.Id)
                .ValueGeneratedOnAdd();

            builder.Property(c => c.Title)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(c => c.Description)
                .HasMaxLength(2000)
                .IsRequired();

            builder.Property(c => c.Price)
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(c => c.Image)
                .HasMaxLength(500);

            builder.Property(c => c.Level)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(c => c.Rating)
                .HasColumnType("decimal(3,2)")
                .HasDefaultValue(0);

            builder.Property(c => c.Duration)
                .IsRequired();

            builder.Property(c => c.IsPublished)
                .HasDefaultValue(true);

            builder.Property(c => c.IsPurchased)
                .HasDefaultValue(false);

            builder.Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(c => c.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            builder.HasIndex(c => c.Title)
                .HasDatabaseName("IX_Courses_Title");

            builder.HasIndex(c => c.CategoryId)
                .HasDatabaseName("IX_Courses_CategoryId");

            builder.HasIndex(c => c.InstructorId)
                .HasDatabaseName("IX_Courses_InstructorId");

            builder.HasIndex(c => c.Level)
                .HasDatabaseName("IX_Courses_Level");

            builder.HasIndex(c => c.Price)
                .HasDatabaseName("IX_Courses_Price");

            builder.HasIndex(c => c.Rating)
                .HasDatabaseName("IX_Courses_Rating");

            builder.HasIndex(c => c.IsPublished)
                .HasDatabaseName("IX_Courses_IsPublished");

            builder.HasIndex(c => c.CreatedAt)
                .HasDatabaseName("IX_Courses_CreatedAt");

            // Relationships
            builder.HasOne(c => c.Category)
                .WithMany(cat => cat.Courses)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Instructor)
                .WithMany(i => i.Courses)
                .HasForeignKey(c => c.InstructorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(c => c.Carts)
                .WithOne(sc => sc.Course)
                .HasForeignKey(sc => sc.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.OrderItems)
                .WithOne(oi => oi.Course)
                .HasForeignKey(oi => oi.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
