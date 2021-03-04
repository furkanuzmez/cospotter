using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("NoteType")]
    public class NoteType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string noteTypeId { get; set; }

        public string name { get; set; }
    }
}
