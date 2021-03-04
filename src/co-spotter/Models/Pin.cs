using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace co_spotter.Models
{
    [Table("Pin")]
    public class Pin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string pinId { get; set; }

        public string content { get; set; }

        public int coordX { get; set; }

        public int coordY { get; set; }

        public DateTime createdAt { get; set; }

        public bool active { get; set; }

        [ForeignKey("staffId")]
        public virtual Staff staff { get; set; }
        public string staffId { get; set; }


        [ForeignKey("planId")]
        public virtual Plan plan { get; set; }
        public string planId { get; set; }

        [ForeignKey("pinTypeId")]
        public virtual PinType pinType { get; set; }
        public string pinTypeId { get; set; }
    }
}
