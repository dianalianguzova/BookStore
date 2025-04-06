using BookStoreAPI.server.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddControllers(); 

builder.Services.AddDbContext<DbConnection>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("BookStoreDefault")));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Book Store API", Version = "v1" });
});

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.UseCors("AllowAll");

app.UseStaticFiles(); // Для обслуживания статических файлов
app.UseDefaultFiles(); // Для автоматического выбора index.html

app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Book Store API V1");
    c.RoutePrefix = "swagger"; 
});


app.MapRazorPages();
app.MapControllers(); 

app.Run();
app.MapFallbackToFile("bookstore.html");