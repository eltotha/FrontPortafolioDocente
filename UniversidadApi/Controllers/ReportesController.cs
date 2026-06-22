using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/reportes/materias-carreras
    [HttpGet("materias-carreras")]
    public async Task<IActionResult> GetReporteMateriasCarreras()
    {
        if (!Request.Headers.ContainsKey("X-User-Role"))
        {
            return StatusCode(403, new { mensaje = "No autorizado." });
        }

        // Realizamos la consulta trayendo las tablas vinculadas
        var reporte = await _context.MateriasCarreras
            .Include(mc => mc.Materia)
            .Include(mc => mc.Carrera)
                .ThenInclude(c => c!.Escuela)
            .Select(mc => new
            {
                Materia = mc.Materia!.Nombre,
                Descripcion = mc.Materia.Descripcion,
                EstadoMateria = mc.Materia.Estado,
                Carrera = mc.Carrera!.Nombre,
                Escuela = mc.Carrera.Escuela!.Nombre,
                EstadoCarrera = mc.Carrera.Estado
            })
            .ToListAsync();

        return Ok(reporte);
    }
}