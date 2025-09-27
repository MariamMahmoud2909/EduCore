using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Infrastructure.Data.Configurations
{
    public class InstructorConfiguration : IEntityTypeConfiguration<Instructor>
    {
        public void Configure(EntityTypeBuilder<Instructor> builder)
        {
            // Table configuration
            builder.ToTable("Instructors");
            builder.HasKey(i => i.Id);

            // Properties configuration
            builder.Property(i => i.Id)
                .ValueGeneratedOnAdd();

            builder.Property(i => i.FirstName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(i => i.LastName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(i => i.Email)
                .HasMaxLength(256)
                .IsRequired();

            builder.Property(i => i.Bio)
                .HasMaxLength(2000);

            builder.Property(i => i.Image)
                .HasMaxLength(500);

            builder.Property(i => i.JobTitle)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(i => i.IsActive)
                .HasDefaultValue(true);

            builder.Property(i => i.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(i => i.UpdatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Indexes
            builder.HasIndex(i => i.Email)
                .IsUnique()
                .HasDatabaseName("IX_Instructors_Email");

            builder.HasIndex(i => new { i.FirstName, i.LastName })
                .HasDatabaseName("IX_Instructors_Name");

            builder.HasIndex(i => i.JobTitle)
                .HasDatabaseName("IX_Instructors_JobTitle");

            builder.HasIndex(i => i.IsActive)
                .HasDatabaseName("IX_Instructors_IsActive");

            // Relationships
            builder.HasMany(i => i.Courses)
                .WithOne(c => c.Instructor)
                .HasForeignKey(c => c.InstructorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
