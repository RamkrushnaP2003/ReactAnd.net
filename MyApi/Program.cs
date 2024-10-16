using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient; // Ensure you have this using directive
using System;
using System.Data;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Configure the HTTP request pipeline
var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");

// Define the API endpoint to show person details
app.MapGet("/api/person", async (HttpContext context) =>
{
    string connectionString = "server=localhost;user=ram;password=ram12345;database=PersonDetailsDB;";

    using (var connection = new MySqlConnection(connectionString))
    {
        await connection.OpenAsync();

        using (var command = new MySqlCommand("SELECT * FROM PersonDetails", connection))
        {
            using (var reader = await command.ExecuteReaderAsync())
            {
                var results = new List<object>();
                while (await reader.ReadAsync())
                {
                    results.Add(new
                    {
                        FirstName = reader["FirstName"].ToString(),
                        LastName = reader["LastName"].ToString(),
                        Email = reader["Email"].ToString(),
                        Contact = reader["Contact"].ToString(),
                        Address = reader["Address"].ToString(),
                        Pincode = reader["Pincode"].ToString(),
                    });
                }
                return Results.Ok(results);
            }
        }
    }
});

// Define the API endpoint to insert person details
app.MapPost("/api/person", async (PersonDetails person) =>
{
    string connectionString = "server=localhost;user=ram;password=ram12345;database=PersonDetailsDB;";

    using (var connection = new MySqlConnection(connectionString))
    {
        await connection.OpenAsync();

        using (var command = new MySqlCommand("InsertPersonDetails", connection))
        {
            command.CommandType = CommandType.StoredProcedure;

            // Add parameters to the command
            command.Parameters.AddWithValue("p_FirstName", person.FirstName);
            command.Parameters.AddWithValue("p_LastName", person.LastName);
            command.Parameters.AddWithValue("p_Email", person.Email);
            command.Parameters.AddWithValue("p_Contact", person.Contact);
            command.Parameters.AddWithValue("p_Address", person.Address);
            command.Parameters.AddWithValue("p_Pincode", person.Pincode);

            try
            {
                await command.ExecuteNonQueryAsync();
                return Results.Ok("Person details inserted successfully.");
            }
            catch (MySqlException ex)
            {
                // Handle MySQL exceptions
                if (ex.Number == 1062) // Duplicate entry error code
                {
                    return Results.BadRequest("Email or Contact already exists.");
                }
                return Results.Problem($"An error occurred: {ex.Message}", statusCode: 500);
            }
        }
    }
});

// Define the API endpoint to delete person details
app.MapDelete("/api/person/{contact}", async (string contact) =>
{
    string connectionString = "server=localhost;user=ram;password=ram12345;database=PersonDetailsDB;";

    using (var connection = new MySqlConnection(connectionString))
    {
        await connection.OpenAsync();

        using (var command = new MySqlCommand("DELETE FROM PersonDetails WHERE Contact = @Contact", connection))
        {
            command.Parameters.AddWithValue("@Contact", contact);

            try
            {
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected > 0)
                {
                    return Results.Ok($"Person with contact {contact} deleted successfully.");
                }
                else
                {
                    return Results.NotFound($"Person with contact {contact} not found.");
                }
            }
            catch (MySqlException ex)
            {
                return Results.Problem($"An error occurred: {ex.Message}", statusCode: 500);
            }
        }
    }
});

// Define the API endpoint to update person details
app.MapPut("/api/person/{contact}", async (string contact, PersonDetails person) =>
{
    string connectionString = "server=localhost;user=ram;password=ram12345;database=PersonDetailsDB;";
    using(var connection = new MySqlConnection(connectionString)) {
        await connection.OpenAsync();
        using(var command = new MySqlCommand("UPDATE PersonDetails SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Address = @Address, Pincode = @Pincode WHERE Contact = @Contact", connection)) 
        {
            command.Parameters.AddWithValue("@FirstName", person.FirstName);
            command.Parameters.AddWithValue("@LastName", person.LastName);
            command.Parameters.AddWithValue("@Email", person.Email);
            command.Parameters.AddWithValue("@Address", person.Address);
            command.Parameters.AddWithValue("@Pincode", person.Pincode);
            command.Parameters.AddWithValue("@Contact", contact); // Unique identifier

            try
            {
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected > 0)
                {
                    return Results.Ok("Person details updated successfully.");
                }
                else
                {
                    return Results.NotFound("Person not found.");
                }
            }
            catch (MySqlException ex)
            {
                return Results.Problem($"An error occurred: {ex.Message}", statusCode: 500);
            }
        }
    }
});

// Run the application
app.Run();

// Define the model for Person Details
public class PersonDetails
{
    public string? FirstName { get; set; } // Nullable
    public string? LastName { get; set; } // Nullable
    public string? Email { get; set; } // Nullable
    public string? Contact { get; set; } // Nullable
    public string? Address { get; set; } // Nullable
    public string? Pincode { get; set; } // Nullable
}
