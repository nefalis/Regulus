from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cycles.views import CycleViewSet


router = DefaultRouter()
router.register(r'cycles', CycleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
