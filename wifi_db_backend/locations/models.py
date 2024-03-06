from django.contrib.gis.db import models

# Create your models here.
class Location(models.Model):
    place_name = models.CharField(max_length=200 , null=True, blank=True)
    coordinates = models.PointField()