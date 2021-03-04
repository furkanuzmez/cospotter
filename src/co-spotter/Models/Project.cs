using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;


namespace co_spotter.Models
{

    [Table("Project")]

    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string projectId { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string imgSrc { get; set; }

        public DateTime startDate { get; set; }

        public DateTime estimatedFinishtDate { get; set; }

        public DateTime finishDate { get; set; }

        [ForeignKey("companyId")]
        public virtual Company company { get; set; }
        public string companyId { get; set; }
    }
}
