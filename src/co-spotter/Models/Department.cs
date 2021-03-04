using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("Department")]
    public class Department
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string departmentId { get; set; }

        public string name { get; set; }

        [ForeignKey("projectId")]
        public virtual Project project { get; set; }
        public string projectId { get; set; }

    }
}
