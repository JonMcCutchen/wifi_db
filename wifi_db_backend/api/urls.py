from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, SpeedtestViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)
router.register(r'speedtests', SpeedtestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]