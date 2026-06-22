using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversidadApi.Models;

public class MateriaCarrera
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MateriaId { get; set; }
    [ForeignKey("MateriaId")]
    public Materia? Materia { get; set; }

    [Required]
    public int CarreraId { get; set; }
    [ForeignKey("CarreraId")]
    public Carrera? Carrera { get; set; }
}