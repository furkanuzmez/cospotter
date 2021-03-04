using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("NoteImage")]
    public class NoteImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string noteImageId { get; set; }

        public string imgSrc { get; set; }

        [ForeignKey("noteId")]
        public virtual Note note { get; set; }
        public string noteId { get; set; }

        [ForeignKey("staffId")]
        public virtual Staff staff { get; set; }
        public string staffId { get; set; }
    }
}
