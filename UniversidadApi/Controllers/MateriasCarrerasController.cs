using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;
using UniversidadApi.Models;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriasCarrerasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MateriasCarrerasController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/materiascarreras
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var relaciones = await _context.MateriasCarreras
            .Include(mc => mc.Materia)
            .Include(mc => mc.Carrera)
            .Select(mc => new
            {
                mc.Id,
                MateriaId = mc.MateriaId,
                Materia = mc.Materia!.Nombre,
                CarreraId = mc.CarreraId,
                Carrera = mc.Carrera!.Nombre
            })
            .ToListAsync();

        return Ok(relaciones);
    }

    // GET: api/materiascarreras/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var relacion = await _context.MateriasCarreras.FindAsync(id);
        if (relacion == null) return NotFound(new { mensaje = "Relación no encontrada." });
        return Ok(relacion);
    }

    // POST: api/materiascarreras
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MateriaCarrera mcDto)
    {
        _context.MateriasCarreras.Add(mcDto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = mcDto.Id }, mcDto);
    }

    // PUT: api/materiascarreras/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] MateriaCarrera mcDto)
    {
        var relacion = await _context.MateriasCarreras.FindAsync(id);
        if (relacion == null) return NotFound(new { mensaje = "Relación no encontrada." });

        relacion.MateriaId = mcDto.MateriaId;
        relacion.CarreraId = mcDto.CarreraId;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Relación actualizada con éxito." });
    }

    // DELETE: api/materiascarreras/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var relacion = await _context.MateriasCarreras.FindAsync(id);
        if (relacion == null) return NotFound(new { mensaje = "Relación no encontrada." });

        _context.MateriasCarreras.Remove(relacion);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Relación eliminada con éxito." });
    }
}