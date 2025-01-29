import json
from .models import Cycle
from django.views.decorators.csrf import csrf_exempt
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

        # Cas où il n'y a ni cycles ni date de début fournie
        if not start_date_str and not Cycle.objects.exists():
            return JsonResponse({
                'days_remaining': None,
                'next_cycle_date': None,
                'average_cycle_length': 28
            }, status=200)

        # Définir start_date basé sur les cycles existants ou la date fournie
        if not start_date_str:
            last_cycle = Cycle.objects.order_by('-start_date').first()
            if last_cycle:
                start_date = last_cycle.start_date
            else:
                start_date = date.today() - timedelta(days=28)
        else:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()

        # Calcul de la longueur moyenne du cycle
        cycles = Cycle.objects.all().order_by('start_date')
        if not cycles.exists():
            average_cycle_length = 28
        else:
            average_cycle_length = sum(
                (cycle.end_date - cycle.start_date).days 
                for cycle in cycles if cycle.end_date
            ) / max(len([c for c in cycles if c.end_date]), 1)

        # Calcul des jours restants
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


@csrf_exempt
def add_cycle(request):
    """
    Ajoute un nouveau cycle menstruel à la base de données.
    """
    if request.method == 'POST':
        try:
            # Charger les données JSON envoyées par le frontend
            data = json.loads(request.body)
            start_date_str = data.get('start_date')

            if not start_date_str:
                return JsonResponse({'error': 'La date de début est requise.'}, status=400)

            # Convertir la date en objet datetime
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()

            # Vérifier si un cycle existe déjà pour cette date
            if Cycle.objects.filter(start_date=start_date).exists():
                return JsonResponse({'error': 'Un cycle pour cette date existe déjà.'}, status=400)

            # Créer un nouveau cycle
            cycle = Cycle(start_date=start_date, end_date=start_date + timedelta(days=28))
            cycle.save()

            return JsonResponse({
                'message': 'Cycle ajouté avec succès !',
                'start_date': start_date.isoformat()
            }, status=201)

        except ValueError:
            return JsonResponse({'error': 'La date fournie est invalide.'}, status=400)
        except Exception as e:
            print("Erreur serveur :", str(e))
            return JsonResponse({'error': f"Erreur serveur : {str(e)}"}, status=500)
    else:
        return JsonResponse({'error': 'Méthode non autorisée.'}, status=405)
