using System.ComponentModel.DataAnnotations;

namespace UniversidadApi.Models;

public class TipoUsuario
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(100)]
    public string TpNombre { get; set; } = null!;
    [StringLength(255)]
    public string? TpDescripcion { get; set; }
}