using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("Zone")]
    public class Zone
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string zoneId { get; set; }

        public string name { get; set; }

        public int coordX { get; set; }

        public int coordY { get; set; }

        public bool released { get; set; }

        public DateTime createdAt { get; set; }

        [ForeignKey("zoneTypeId")]
        public virtual ZoneType zoneType { get; set; }
        public string zoneTypeId { get; set; }

        [ForeignKey("planId")]
        public virtual Plan plan { get; set; }
        public string planId { get; set; }
    }
}
