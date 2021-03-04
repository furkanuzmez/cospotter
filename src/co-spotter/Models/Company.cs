using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace co_spotter.Models
{
    [Table("Company")]
    public class Company
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string companyId { get; set; }

        public string name { get; set; }

        public string email { get; set; }

        public string phone { get; set; }

        public string address { get; set; }

        public string website { get; set; }

        public string logoImgSrc { get; set; }

        public DateTime createdAt { get; set; }

        public bool active { get; set; }
    }
}
