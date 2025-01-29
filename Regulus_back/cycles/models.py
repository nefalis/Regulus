from django.db import models

class Cycle(models.Model):
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def duration(self):
        return (self.end_date - self.start_date).days

    def __str__(self):
        return f"Cycle from {self.start_date} to {self.end_date}"
