from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cycles.views import CycleViewSet, get_remaining_days



router = DefaultRouter()
router.register(r'cycles', CycleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/remaining_days/', get_remaining_days, name='get_remaining_days')
]
