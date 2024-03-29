from django.contrib.gis.db import models
from django.conf import settings

from locations.models import Location

class Speedtest(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='speed_tests')
    download_speed = models.FloatField() # in Mbps
    upload_speed = models.FloatField() # in Mbps
    ping = models.FloatField() # in ms
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location.name} - {self.timestamp}"