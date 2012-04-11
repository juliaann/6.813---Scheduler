from django.db import models
from django.contrib.auth.models import User

class Shift(models.Model):
    date = models.DateField()

    SHIFT_TIMES = (
        (0, u'Day'),
        (1, u'Evening'),
        (2, u'Night'),
    )
        
    time = models.IntegerField(choices = SHIFT_TIMES)


    
    def __unicode__(self):
        return str(self.date) + str(self.time)


class ScheduledShifts(models.Model):
    shift = models.ManyToManyField(Shift)
    instructor = models.ManyToManyField(User)

    SHIFT_STATUS = (
        (0, u'Normal'),
        (1, u'PendingAdd'),
        (2, u'PendingDelete'),
        (3, u'Excused'),
        (4, u'Absent'),
    )

    status = models.IntegerField(choices = SHIFT_STATUS)
