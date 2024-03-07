from rest_framework import viewsets, status
from locations.models import Location
from locations.serializers import LocationSerializer
from speedtests.models import Speedtest
from speedtests.serializers import SpeedtestSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    @action(detail=False, methods=['get'])
    def get_matching_location(self, request):
        place_name = request.query_params.get('place_name')
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
    
        if not all([place_name, latitude, longitude]):
            return Response({'error': 'Missing parameters: place_name, latitude, and longitude are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create a Point from the latitude and longitude
            point = Point(float(latitude), float(longitude), srid=4326)
        except ValueError:
            return Response({'error': 'Invalid latitude and longitude.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the closest location within the specified tolerance (e.g., 1 meter)
        tolerance = D(m=1)  # You can adjust the distance according to your needs
        matching_location = Location.objects.filter(coordinates__distance_lte=(point, tolerance), place_name=place_name).order_by('coordinates').first()

        if matching_location:
            serializer = self.get_serializer(matching_location)
            return Response(serializer.data)
        else:
            return Response({'error': 'No matching location found.'}, status=status.HTTP_404_NOT_FOUND)

class SpeedtestViewSet(viewsets.ModelViewSet):
    queryset = Speedtest.objects.all()
    serializer_class = SpeedtestSerializer

    
