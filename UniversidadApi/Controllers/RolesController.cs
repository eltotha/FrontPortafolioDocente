using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;
using UniversidadApi.Models;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/roles
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Permitir lectura general para alimentar los formularios select de usuarios
        var tipos = await _context.TiposUsuarios.ToListAsync();
        return Ok(tipos);
    }

    // GET: api/roles/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tipo = await _context.TiposUsuarios.FindAsync(id);
        if (tipo == null) return NotFound(new { mensaje = "Rol no encontrado." });
        return Ok(tipo);
    }

    // POST: api/roles
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TipoUsuario tipoUsuario)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado. Se requieren permisos de Administrador." });

        _context.TiposUsuarios.Add(tipoUsuario);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tipoUsuario.Id }, tipoUsuario);
    }

    // PUT: api/roles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TipoUsuario tipoUsuarioDto)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado. Se requieren permisos de Administrador." });

        var tipoUsuario = await _context.TiposUsuarios.FindAsync(id);
        if (tipoUsuario == null) return NotFound(new { mensaje = "Rol no encontrado." });

        tipoUsuario.TpNombre = tipoUsuarioDto.TpNombre;
        tipoUsuario.TpDescripcion = tipoUsuarioDto.TpDescripcion;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Rol actualizado con éxito." });
    }

    // DELETE: api/roles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!EsAdministrador()) return StatusCode(403, new { mensaje = "Acceso denegado. Se requieren permisos de Administrador." });

        var tipoUsuario = await _context.TiposUsuarios.FindAsync(id);
        if (tipoUsuario == null) return NotFound(new { mensaje = "Rol no encontrado." });

        _context.TiposUsuarios.Remove(tipoUsuario);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Rol eliminado con éxito." });
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