using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("PinType")]
    public class PinType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string pinTypeId { get; set; }

        public string name { get; set; }
    }
}
