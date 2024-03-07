from rest_framework import serializers
from speedtests.models import Speedtest
from speedtests.serializers import SpeedtestSerializer
from .models import Location
from django.contrib.gis.geos import Point
from django.contrib.gis.geos import GEOSGeometry

class LocationSerializer(serializers.ModelSerializer):
    most_recent_speedtest = serializers.SerializerMethodField()
    class Meta:
        model = Location
        fields = ['id', 'place_name', 'coordinates', 'most_recent_speedtest']

    def create(self, validated_data):
        coordinates = validated_data.pop('coordinates', None)
        if coordinates:
            # Convert the WKT string to a GEOSGeometry object
            validated_data['coordinates'] = GEOSGeometry(coordinates)
        return Location.objects.create(**validated_data)

    def update(self, instance, validated_data):
        coordinates = validated_data.pop('coordinates', None)
        if coordinates:
            instance.coordinates = Point(coordinates['coordinates'])
        return super().update(instance, validated_data)
    
    def get_most_recent_speedtest(self, obj):
        speedtest = Speedtest.objects.filter(location=obj).order_by('-timestamp').first()
        if speedtest:
            return SpeedtestSerializer(speedtest).data
        return None