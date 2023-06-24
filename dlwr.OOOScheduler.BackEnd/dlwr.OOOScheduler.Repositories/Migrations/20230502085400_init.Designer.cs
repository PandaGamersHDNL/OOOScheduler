﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using dlwr.OOOScheduler.Repositories.Database;

#nullable disable

namespace dlwr.OOOScheduler.Repositories.Migrations
{
    [DbContext(typeof(DlwrContext))]
    [Migration("20230502085400_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.DbUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("MessageStr")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.Setting", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsEnabled")
                        .HasColumnType("bit");

                    b.Property<float>("Threshold")
                        .HasColumnType("real");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("lwr.OOOScheduler.Repositories.Models.PlaceHolder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("DefaultValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Placeholders");

                    b.HasDiscriminator<string>("Discriminator").IsComplete(false).HasValue("PlaceHolder");

                    b.UseTphMappingStrategy();

                    b.HasData(
                        new
                        {
                            Id = 1,
                            DefaultValue = "Displays the start date and time of the event",
                            Name = "startDate"
                        },
                        new
                        {
                            Id = 2,
                            DefaultValue = "Displays the end date and time of the event",
                            Name = "endDate"
                        });
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.CustomPlaceHolder", b =>
                {
                    b.HasBaseType("lwr.OOOScheduler.Repositories.Models.PlaceHolder");

                    b.Property<string>("DbUserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasIndex("DbUserId");

                    b.HasDiscriminator().HasValue("CustomPlaceHolder");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.Message", b =>
                {
                    b.HasOne("dlwr.OOOScheduler.Repositories.Models.DbUser", "User")
                        .WithMany("Messages")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.Setting", b =>
                {
                    b.HasOne("dlwr.OOOScheduler.Repositories.Models.DbUser", "User")
                        .WithOne("Setting")
                        .HasForeignKey("dlwr.OOOScheduler.Repositories.Models.Setting", "UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.CustomPlaceHolder", b =>
                {
                    b.HasOne("dlwr.OOOScheduler.Repositories.Models.DbUser", null)
                        .WithMany("CustomPlaceholders")
                        .HasForeignKey("DbUserId");
                });

            modelBuilder.Entity("dlwr.OOOScheduler.Repositories.Models.DbUser", b =>
                {
                    b.Navigation("CustomPlaceholders");

                    b.Navigation("Messages");

                    b.Navigation("Setting");
                });
#pragma warning restore 612, 618
        }
    }
}
