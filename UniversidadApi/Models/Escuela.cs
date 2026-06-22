using System.ComponentModel.DataAnnotations;

namespace UniversidadApi.Models;

public class Escuela
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(150)]
    public string Nombre { get; set; } = null!;
    [Required, StringLength(50)]
    public string Estado { get; set; } = "Operativa";
}