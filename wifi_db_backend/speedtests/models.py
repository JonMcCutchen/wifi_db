from django.contrib.gis.db import models
from django.conf import settings

from wifi_db_backend.locations.models import Location

class Speedtest(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='speed_tests')
    download_speed = models.FloatField() # in Mbps
    upload_speed = models.FloatField() # in Mbps
    ping = models.FloatField() # in ms
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='speed_tests')

    def __str__(self):
        return f"{self.location.name} - {self.timestamp}"