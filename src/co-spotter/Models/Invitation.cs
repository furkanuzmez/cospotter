using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("Invitation")]
    public class Invitation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string invitationId { get; set; }

        public string email { get; set; }

        public string code { get; set; }

        public bool response { get; set; }

        public string roleId { get; set; }

        [ForeignKey("departmentId")]
        public virtual Department department { get; set; }
        public string departmentId { get; set; }
    }
}
