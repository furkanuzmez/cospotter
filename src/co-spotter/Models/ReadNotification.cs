using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace co_spotter.Models
{
    [Table("ReadNotification")]
    public class ReadNotification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string readNotificationId { get; set; }

        public DateTime readDate { get; set; }

        [ForeignKey("notificationId")]
        public virtual Notification notification { get; set; }
        public string notificationId { get; set; }

        [ForeignKey("staffId")]
        public virtual Staff staff { get; set; }
        public string staffId { get; set; }
    }
}
