using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dlwr.OOOScheduler.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class defaultMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefaultMessageId",
                table: "Settings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultMessageId",
                table: "Settings");
        }
    }
}
