using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;
using UniversidadApi.Models;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsuariosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var usuarios = await _context.Usuarios
            .Include(u => u.TipoUsuario)
            .Include(u => u.Escuela)
            .Select(u => new {
                u.Id,
                u.Nombre,
                u.Apellido,
                FechaNac = u.FechaNac.ToString("dd/MM/yyyy"),
                u.Correo,
                u.Username,
                u.Password,
                TipoId = u.TipoUsuarioId,
                Tipo = u.TipoUsuario!.TpNombre,
                u.Estado,
                EscuelaId = u.EscuelaId,
                Escuela = u.Escuela!.Nombre
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado." });

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Usuario usuario)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Usuario usuarioDto)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado." });

        usuario.Nombre = usuarioDto.Nombre;
        usuario.Apellido = usuarioDto.Apellido;
        usuario.FechaNac = usuarioDto.FechaNac;
        usuario.Correo = usuarioDto.Correo;
        usuario.Username = usuarioDto.Username;
        usuario.Password = usuarioDto.Password;
        usuario.Estado = usuarioDto.Estado;
        usuario.TipoUsuarioId = usuarioDto.TipoUsuarioId;
        usuario.EscuelaId = usuarioDto.EscuelaId;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Usuario actualizado con éxito." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado." });

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Usuario eliminado con éxito." });
    }

    [HttpGet("tipos")]
    public async Task<IActionResult> GetTipos()
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado." });
        return Ok(await _context.TiposUsuarios.ToListAsync());
    }

    private bool EsAdministrador()
    {
        if (Request.Headers.TryGetValue("X-User-Role", out var role))
        {
            return role.ToString() == "Administrador";
        }
        return false;
    }
}