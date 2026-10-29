using Application.Interfaces;
using Application.Services;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SqlCon")));

builder.Services.AddScoped<ITopCategories, TopCategoriesRepository>();
builder.Services.AddScoped<TopCategoriesService>();

builder.Services.AddScoped<ITrendingProducts, TrendingProductsRepository>();
builder.Services.AddScoped<TrendingProductsService>();

builder.Services.AddScoped<IBlogPost, BlogPostRepository>();
builder.Services.AddScoped<BlogPostService>();

builder.Services.AddScoped<IUser, UserRepository>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<IRole, RoleRepository>();
builder.Services.AddScoped<RoleService>();

builder.Services.AddScoped<IUserRole, UserRoleRepository>();
builder.Services.AddScoped<UserRoleService>();

builder.Services.AddScoped<IHomeDecore, HomeDecoreRepository>();
builder.Services.AddScoped<HomeDecoreService>();

builder.Services.AddScoped<IHeroBanner, HeroBannerRepository>();
builder.Services.AddScoped<HeroBannerService>();

builder.Services.AddScoped<ILogo, LogoRepository>();
builder.Services.AddScoped<LogoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("dxgfchvjbkaxhcbjnddascd234wse4esdfghjkfghfghsrdtfyghtfyg"))
    };
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();