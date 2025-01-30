from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cycles.views import CycleViewSet, get_remaining_days, add_cycle, delete_cycle



router = DefaultRouter()
router.register(r'cycles', CycleViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/get_remaining_days/', get_remaining_days, name='get_remaining_days'),
    path('api/add_cycle/', add_cycle, name='add_cycle'),
    path('api/cycles/<int:cycle_id>/', delete_cycle, name='delete_cycle'),
]
