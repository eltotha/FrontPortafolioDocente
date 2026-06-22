using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // 1. Buscamos por nombre de usuario de forma simple (método seguro y compatible con .NET 10)
        var usuariosDisponibles = await _context.Usuarios
            .Include(u => u.TipoUsuario)
            .Where(u => u.Username == request.Username)
            .ToListAsync();

        // 2. Evaluamos la contraseña en memoria para saltar el bug de traducción de Pomelo 9 en .NET 10
        var usuario = usuariosDisponibles
            .FirstOrDefault(u => u.Password == request.Password);

        if (usuario == null)
        {
            return Unauthorized(new { mensaje = "Credenciales incorrectas" });
        }

        if (usuario.Estado != "Activo")
        {
            return StatusCode(403, new { mensaje = "El usuario no se encuentra activo" });
        }

        return Ok(new
        {
            Id = usuario.Id,
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Username = usuario.Username,
            Tipo = usuario.TipoUsuario!.TpNombre
        });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}