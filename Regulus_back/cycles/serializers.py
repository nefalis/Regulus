from rest_framework import serializers
from .models import Cycle


class CycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cycle
        fields = ['id', 'start_date', 'end_date', 'duration']
