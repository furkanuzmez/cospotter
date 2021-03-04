using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("ZoneType")]
    public class ZoneType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string zoneTypeId { get; set; }

        public string name { get; set; }

        public string zoneTypeColor { get; set; }

        [ForeignKey("projectId")]
        public virtual Project project { get; set; }
        public string projectId { get; set; }
    }
}
