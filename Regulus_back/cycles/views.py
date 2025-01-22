from .models import Cycle
from rest_framework import viewsets
from .serializers import CycleSerializer
from django.http import JsonResponse
from datetime import datetime, timedelta, date


class CycleViewSet(viewsets.ModelViewSet):
    queryset = Cycle.objects.all()
    serializer_class = CycleSerializer


def get_remaining_days(request):
    """
    Récupère les informations sur le cycle menstruel et calcule les jours restants avant les prochaines règles.
    """
    try:
        start_date_str = request.GET.get('start_date')
        
        if not start_date_str and not Cycle.objects.exists():
            return JsonResponse({'error': 'La date de début des dernières règles est requise.'}, status=400)
        
        if not start_date_str:
            last_cycle = Cycle.objects.order_by('-start_date').first()
            if last_cycle:
                start_date = last_cycle.start_date
            else:
                start_date = date.today() - timedelta(days=28)
        else:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        
        cycles = Cycle.objects.all().order_by('start_date')
        if not cycles.exists():
            average_cycle_length = 28
        else:
            average_cycle_length = sum(
                (cycle.end_date - cycle.start_date).days 
                for cycle in cycles if cycle.end_date
            ) / max(len(cycles), 1)
        
        next_cycle_date = start_date + timedelta(days=average_cycle_length)
        today = date.today()
        days_remaining = max(0, (next_cycle_date - today).days)
        
        return JsonResponse({
            'days_remaining': days_remaining,
            'next_cycle_date': next_cycle_date.isoformat(),
            'average_cycle_length': round(average_cycle_length)
        })
    except ValueError:
        return JsonResponse({'error': 'La date fournie est invalide.'}, status=400)
