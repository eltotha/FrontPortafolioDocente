using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversidadApi.Data;
using UniversidadApi.Models;

namespace UniversidadApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AcademicoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AcademicoController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ==========================================
    //           CRUD: ESCUELAS (Solo Admin)
    // ==========================================

    [HttpGet("escuelas")]
    public async Task<IActionResult> GetEscuelas()
    {
        return Ok(await _context.Escuelas.ToListAsync());
    }

    [HttpGet("escuelas/{id}")]
    public async Task<IActionResult> GetEscuelaById(int id)
    {
        var escuela = await _context.Escuelas.FindAsync(id);
        if (escuela == null) return NotFound(new { mensaje = "Escuela no encontrada." });
        return Ok(escuela);
    }

    [HttpPost("escuelas")]
    public async Task<IActionResult> CreateEscuela([FromBody] Escuela escuela)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        _context.Escuelas.Add(escuela);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEscuelaById), new { id = escuela.Id }, escuela);
    }

    [HttpPut("escuelas/{id}")]
    public async Task<IActionResult> UpdateEscuela(int id, [FromBody] Escuela escuelaDto)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var escuela = await _context.Escuelas.FindAsync(id);
        if (escuela == null) return NotFound(new { mensaje = "Escuela no encontrada." });

        escuela.Nombre = escuelaDto.Nombre;
        escuela.Estado = escuelaDto.Estado;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Escuela actualizada con éxito." });
    }

    [HttpDelete("escuelas/{id}")]
    public async Task<IActionResult> DeleteEscuela(int id)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var escuela = await _context.Escuelas.FindAsync(id);
        if (escuela == null) return NotFound(new { mensaje = "Escuela no encontrada." });

        _context.Escuelas.Remove(escuela);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Escuela eliminada con éxito." });
    }

    // ==========================================
    //           CRUD: CARRERAS (Solo Admin)
    // ==========================================

    [HttpGet("carreras")]
    public async Task<IActionResult> GetCarreras()
    {
        var carreras = await _context.Carreras
            .Include(c => c.Escuela)
            .Select(c => new {
                c.Id,
                c.Nombre,
                EscuelaId = c.EscuelaId,
                Escuela = c.Escuela!.Nombre,
                c.Estado
            }).ToListAsync();
        return Ok(carreras);
    }

    [HttpGet("carreras/{id}")]
    public async Task<IActionResult> GetCarreraById(int id)
    {
        var carrera = await _context.Carreras.FindAsync(id);
        if (carrera == null) return NotFound(new { mensaje = "Carrera no encontrada." });
        return Ok(carrera);
    }

    [HttpPost("carreras")]
    public async Task<IActionResult> CreateCarrera([FromBody] Carrera carrera)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        _context.Carreras.Add(carrera);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCarreraById), new { id = carrera.Id }, carrera);
    }

    [HttpPut("carreras/{id}")]
    public async Task<IActionResult> UpdateCarrera(int id, [FromBody] Carrera carreraDto)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var carrera = await _context.Carreras.FindAsync(id);
        if (carrera == null) return NotFound(new { mensaje = "Carrera no encontrada." });

        carrera.Nombre = carreraDto.Nombre;
        carrera.EscuelaId = carreraDto.EscuelaId;
        carrera.Estado = carreraDto.Estado;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Carrera actualizada con éxito." });
    }

    [HttpDelete("carreras/{id}")]
    public async Task<IActionResult> DeleteCarrera(int id)
    {
        if (!VerificarRol("Administrador")) return StatusCode(403, new { mensaje = "Acceso denegado." });

        var carrera = await _context.Carreras.FindAsync(id);
        if (carrera == null) return NotFound(new { mensaje = "Carrera no encontrada." });

        _context.Carreras.Remove(carrera);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Carrera eliminada con éxito." });
    }

    // ==========================================
    //      CRUD: MATERIAS (Admin y Docente)
    // ==========================================

    [HttpGet("materias")]
    public async Task<IActionResult> GetMaterias()
    {
        var materias = await _context.Materias
            .Include(m => m.Escuela)
            .Select(m => new {
                m.Id,
                m.Nombre,
                m.Descripcion,
                m.Estado,
                EscuelaId = m.EscuelaId,
                Escuela = m.Escuela!.Nombre
            }).ToListAsync();
        return Ok(materias);
    }

    [HttpGet("materias/{id}")]
    public async Task<IActionResult> GetMateriaById(int id)
    {
        var materia = await _context.Materias.FindAsync(id);
        if (materia == null) return NotFound(new { mensaje = "Materia no encontrada." });
        return Ok(materia);
    }

    [HttpPost("materias")]
    public async Task<IActionResult> CreateMateria([FromBody] Materia materia)
    {
        // Ambos roles pueden gestionar materias si la lógica de tu portafolio lo permite
        if (!ObtenerRol(out _)) return StatusCode(403, new { mensaje = "No autorizado." });

        _context.Materias.Add(materia);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMateriaById), new { id = materia.Id }, materia);
    }

    [HttpPut("materias/{id}")]
    public async Task<IActionResult> UpdateMateria(int id, [FromBody] Materia materiaDto)
    {
        if (!ObtenerRol(out _)) return StatusCode(403, new { mensaje = "No autorizado." });

        var materia = await _context.Materias.FindAsync(id);
        if (materia == null) return NotFound(new { mensaje = "Materia no encontrada." });

        materia.Nombre = materiaDto.Nombre;
        materia.Descripcion = materiaDto.Descripcion;
        materia.Estado = materiaDto.Estado;
        materia.EscuelaId = materiaDto.EscuelaId;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Materia actualizada con éxito." });
    }

    [HttpDelete("materias/{id}")]
    public async Task<IActionResult> DeleteMateria(int id)
    {
        if (!ObtenerRol(out _)) return StatusCode(403, new { mensaje = "No autorizado." });

        var materia = await _context.Materias.FindAsync(id);
        if (materia == null) return NotFound(new { mensaje = "Materia no encontrada." });

        _context.Materias.Remove(materia);
        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Materia eliminada con éxito." });
    }

    // ==========================================
    //               AUXILIARES
    // ==========================================

    private bool ObtenerRol(out string rol)
    {
        rol = string.Empty;
        if (Request.Headers.TryGetValue("X-User-Role", out var headerValue))
        {
            rol = headerValue.ToString();
            return true;
        }
        return false;
    }

    private bool VerificarRol(string rolRequerido)
    {
        return ObtenerRol(out string rolActual) && rolActual == rolRequerido;
    }
}