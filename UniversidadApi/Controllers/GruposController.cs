using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;
using UniversidadApi.Models;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GruposController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GruposController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/grupos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var grupos = await _context.Grupos
            .Include(g => g.Materia)
            .Select(g => new
            {
                g.Id,
                Nombre = g.Codigo, // Mapeamos Codigo al campo visual 'nombre'
                MateriaId = g.MateriaId,
                Materia = g.Materia!.Nombre,
                Estado = g.Materia.Estado // Usamos el estado de la materia como referencia
            })
            .ToListAsync();

        return Ok(grupos);
    }

    // GET: api/grupos/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var grupo = await _context.Grupos.FindAsync(id);
        if (grupo == null) return NotFound(new { mensaje = "Grupo no encontrado." });
        return Ok(grupo);
    }

    // POST: api/grupos
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Grupo grupo)
    {
        _context.Grupos.Add(grupo);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = grupo.Id }, grupo);
    }

    // PUT: api/grupos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Grupo grupoDto)
    {
        var grupo = await _context.Grupos.FindAsync(id);
        if (grupo == null) return NotFound(new { mensaje = "Grupo no encontrado." });

        grupo.Codigo = grupoDto.Codigo;
        grupo.MateriaId = grupoDto.MateriaId;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Grupo actualizado con éxito." });
    }

    // DELETE: api/grupos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var grupo = await _context.Grupos.FindAsync(id);
        if (grupo == null) return NotFound(new { mensaje = "Grupo no encontrado." });

        _context.Grupos.Remove(grupo);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Grupo eliminado con éxito." });
    }
}