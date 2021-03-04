using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;


namespace co_spotter.Models
{
    [Table("Plan")]
    public class Plan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string planId { get; set; }

        public string name { get; set; }

        public string imgSrc { get; set; }

        public int width { get; set; }

        public int height { get; set; }

        public string thumbImgSrc { get; set; }

        public DateTime createdAt { get; set; }

        public bool active { get; set; }

        [ForeignKey("projectId")]
        public virtual Project project { get; set; }
        public string projectId { get; set; }
    }
}
