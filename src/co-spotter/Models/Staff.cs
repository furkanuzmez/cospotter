using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("Staff")]
    public class Staff
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string staffId { get; set; }

        [ForeignKey("departmentId")]
        public virtual Department department { get; set; }
        public string departmentId { get; set; }

        [ForeignKey("Id")]
        public virtual ApplicationUser user { get; set; }
        public string Id { get; set; }
    }
}
