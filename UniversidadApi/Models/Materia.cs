using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversidadApi.Models;

public class Materia
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(150)]
    public string Nombre { get; set; } = null!;
    [StringLength(500)]
    public string? Descripcion { get; set; }
    [Required, StringLength(50)]
    public string Estado { get; set; } = "Disponible";

    [Required]
    public int EscuelaId { get; set; }
    [ForeignKey("EscuelaId")]
    public Escuela? Escuela { get; set; }
}