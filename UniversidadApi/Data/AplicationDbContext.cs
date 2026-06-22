using Microsoft.EntityFrameworkCore;
using UniversidadApi.Models;

namespace UniversidadApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<TipoUsuario> TiposUsuarios { get; set; }
    public DbSet<Escuela> Escuelas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Carrera> Carreras { get; set; }
    public DbSet<Materia> Materias { get; set; }
    public DbSet<MateriaCarrera> MateriasCarreras { get; set; }
    public DbSet<Grupo> Grupos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed TipoUsuario
        modelBuilder.Entity<TipoUsuario>().HasData(
            new TipoUsuario { Id = 1, TpNombre = "Administrador", TpDescripcion = "Usuario con privilegios completos" },
            new TipoUsuario { Id = 2, TpNombre = "Docente", TpDescripcion = "Usuario con permisos para gestionar materias" }
        );

        // Seed Escuelas
        modelBuilder.Entity<Escuela>().HasData(
            new Escuela { Id = 1, Nombre = "Escuela de Ingeniería en Sistemas", Estado = "Operativa" },
            new Escuela { Id = 2, Nombre = "Escuela de Ciencias Sociales", Estado = "Operativa" },
            new Escuela { Id = 3, Nombre = "Escuela de Medicina", Estado = "Operativa" }
        );

        // Seed Usuarios
        modelBuilder.Entity<Usuario>().HasData(
            new Usuario { Id = 1, Nombre = "Eduardo", Apellido = "Gonzalez", FechaNac = new DateTime(2000, 2, 27), Correo = "eduar2.gm2020@gmail.com", Username = "eduardo", Password = "eduardo", TipoUsuarioId = 1, EscuelaId = 1, Estado = "Activo" },
            new Usuario { Id = 2, Nombre = "Sofia", Apellido = "Gonzalez", FechaNac = new DateTime(2006, 9, 23), Correo = "sngm@gmail.com", Username = "sofia", Password = "sofia", TipoUsuarioId = 2, EscuelaId = 3, Estado = "Activo" }
        );

        // Seed Carreras
        modelBuilder.Entity<Carrera>().HasData(
            new Carrera { Id = 1, Nombre = "Ingeniería en Sistemas", EscuelaId = 1, Estado = "Operativa" },
            new Carrera { Id = 2, Nombre = "Ciencias Sociales", EscuelaId = 2, Estado = "Operativa" },
            new Carrera { Id = 3, Nombre = "Medicina", EscuelaId = 3, Estado = "Operativa" }
        );

        // Seed Materias
        modelBuilder.Entity<Materia>().HasData(
            new Materia { Id = 1, Nombre = "Matemáticas Discretas", Descripcion = "Curso introductorio a las matemáticas discretas", EscuelaId = 1, Estado = "Disponible" },
            new Materia { Id = 2, Nombre = "Física General", Descripcion = "Fundamentos de física clásica", EscuelaId = 1, Estado = "Disponible" },
            new Materia { Id = 3, Nombre = "Programación Avanzada", Descripcion = "Curso que cubre técnicas avanzadas", EscuelaId = 1, Estado = "Disponible" },
            new Materia { Id = 4, Nombre = "Anatomía Humana", Descripcion = "Estudio de la estructura del cuerpo humano", EscuelaId = 3, Estado = "Disponible" }
        );
    }
}