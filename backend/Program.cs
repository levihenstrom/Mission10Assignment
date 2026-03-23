// Program.cs — Entry point for the Bowling League ASP.NET Web API
// Serves bowler data from a SQLite database to the React frontend

using Microsoft.Data.Sqlite;

// Create the web application builder
var builder = WebApplication.CreateBuilder(args);

// -----------------------------------------------------------------------
// Register services
// -----------------------------------------------------------------------

// Add CORS so the React dev server (Vite) can call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",
                  "http://localhost:5174",
                  "http://localhost:5175",
                  "http://localhost:5176",
                  "http://localhost:5177",
                  "http://localhost:5178",
                  "http://localhost:5179",
                  "https://localhost:5173",
                  "https://localhost:5174",
                  "https://localhost:5175",
                  "https://localhost:5176",
                  "https://localhost:5177",
                  "https://localhost:5178",
                  "https://localhost:5179"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Build the application
var app = builder.Build();

// -----------------------------------------------------------------------
// Configure middleware pipeline
// -----------------------------------------------------------------------

// Apply the CORS policy to all requests
app.UseCors("AllowReactApp");

// Avoid HTTP->HTTPS redirects in local development. Redirects can break
// frontend fetch calls when the browser blocks cross-origin HTTPS redirects.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// -----------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------

// GET /api/bowlers
// Returns a list of bowlers who are on the Marlins or Sharks teams,
// joined with team name and ordered by team then last name.
app.MapGet("/api/bowlers", (IConfiguration config) =>
{
    // Read the connection string from appsettings.json
    var connectionString = config.GetConnectionString("BowlingLeague");

    // List to hold the results
    var bowlers = new List<Bowler>();

    // Open a connection to the SQLite database
    using var connection = new SqliteConnection(connectionString);
    connection.Open();

    // Query: join Bowlers with Teams, filter to Marlins and Sharks only
    var command = connection.CreateCommand();
    command.CommandText = @"
        SELECT b.BowlerFirstName,
               b.BowlerMiddleInit,
               b.BowlerLastName,
               b.BowlerAddress,
               b.BowlerCity,
               b.BowlerState,
               b.BowlerZip,
               b.BowlerPhoneNumber,
               t.TeamName
        FROM Bowlers b
        JOIN Teams t ON b.TeamID = t.TeamID
        WHERE t.TeamName IN ('Marlins', 'Sharks')
        ORDER BY t.TeamName, b.BowlerLastName;
    ";

    // Read each row and map it to a Bowler record
    using var reader = command.ExecuteReader();
    while (reader.Read())
    {
        bowlers.Add(new Bowler(
            BowlerFirstName:   reader.GetString(0),
            BowlerMiddleInit:  reader.IsDBNull(1) ? null : reader.GetString(1),
            BowlerLastName:    reader.GetString(2),
            BowlerAddress:     reader.GetString(3),
            BowlerCity:        reader.GetString(4),
            BowlerState:       reader.GetString(5),
            BowlerZip:         reader.GetString(6),
            BowlerPhoneNumber: reader.GetString(7),
            TeamName:          reader.GetString(8)
        ));
    }

    // Return the list as JSON
    return Results.Ok(bowlers);
});

// Start the application
app.Run();

// -----------------------------------------------------------------------
// Data model
// -----------------------------------------------------------------------

/// <summary>
/// Represents a bowler record returned by the API.
/// All fields map directly to database columns from the Bowlers/Teams tables.
/// </summary>
record Bowler(
    string BowlerFirstName,
    string? BowlerMiddleInit,
    string BowlerLastName,
    string BowlerAddress,
    string BowlerCity,
    string BowlerState,
    string BowlerZip,
    string BowlerPhoneNumber,
    string TeamName
);
