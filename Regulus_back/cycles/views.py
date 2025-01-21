from .models import Cycle
from rest_framework import viewsets
from .serializers import CycleSerializer


class CycleViewSet(viewsets.ModelViewSet):
    queryset = Cycle.objects.all()
    serializer_class = CycleSerializer
