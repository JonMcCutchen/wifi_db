from rest_framework import serializers
from .models import Speedtest

class SpeedtestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speedtest
        fields = '__all__'