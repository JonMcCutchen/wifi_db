from rest_framework import viewsets
from locations.models import Location
from locations.serializers import LocationSerializer
from speedtests.models import Speedtest
from speedtests.serializers import SpeedtestSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class SpeedtestViewSet(viewsets.ModelViewSet):
    queryset = Speedtest.objects.all()
    serializer_class = SpeedtestSerializer