using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversidadApi.Models;

public class Grupo
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(50)]
    public string Codigo { get; set; } = null!;

    [Required]
    public int MateriaId { get; set; }
    [ForeignKey("MateriaId")]
    public Materia? Materia { get; set; }
}