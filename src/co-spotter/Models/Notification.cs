using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace co_spotter.Models
{
    [Table("Notification")]
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string notificationId { get; set; }

        public string tableName { get; set; }

        public string tupleId { get; set; }

        public int process { get; set; }

    }
}
