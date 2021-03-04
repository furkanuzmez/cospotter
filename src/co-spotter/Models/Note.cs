using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace co_spotter.Models
{
    [Table("Note")]
    public class Note
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string noteId { get; set; }

        public string content { get; set; }

        public DateTime createdAt { get; set; }

        [ForeignKey("zoneId")]
        public virtual Zone zone { get; set; }
        public string zoneId { get; set; }

        [ForeignKey("staffId")]
        public virtual Staff staff { get; set; }
        public string staffId { get; set; }

        [ForeignKey("noteTypeId")]
        public virtual NoteType noteType { get; set; }
        public string noteTypeId { get; set; }
    }
}
