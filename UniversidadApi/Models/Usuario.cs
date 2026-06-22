using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversidadApi.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }
    [Required, StringLength(100)]
    public string Nombre { get; set; } = null!;
    [Required, StringLength(100)]
    public string Apellido { get; set; } = null!;
    public DateTime FechaNac { get; set; }
    [Required, EmailAddress, StringLength(150)]
    public string Correo { get; set; } = null!;
    [Required, StringLength(50)]
    public string Username { get; set; } = null!;
    [Required, StringLength(255)]
    public string Password { get; set; } = null!;
    [Required, StringLength(50)]
    public string Estado { get; set; } = "Activo";

    [Required]
    public int TipoUsuarioId { get; set; }
    [ForeignKey("TipoUsuarioId")]
    public TipoUsuario? TipoUsuario { get; set; }

    [Required]
    public int EscuelaId { get; set; }
    [ForeignKey("EscuelaId")]
    public Escuela? Escuela { get; set; }
}