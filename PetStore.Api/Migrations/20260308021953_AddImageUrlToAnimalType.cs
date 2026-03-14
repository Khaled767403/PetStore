using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetStore.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToAnimalType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "AnimalTypes",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "AnimalTypes");
        }
    }
}
