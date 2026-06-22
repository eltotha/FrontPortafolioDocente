using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversidadApi.Models;

public class Carrera
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(150)]
    public string Nombre { get; set; } = null!;
    [Required, StringLength(50)]
    public string Estado { get; set; } = "Operativa";

    [Required]
    public int EscuelaId { get; set; }
    [ForeignKey("EscuelaId")]
    public Escuela? Escuela { get; set; }
}