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
            # Calculer la durée entre les débuts des cycles successifs
            cycle_durations = []
            previous_cycle = None
            for cycle in cycles:
                if previous_cycle:
                    duration = (cycle.start_date - previous_cycle.start_date).days
                    cycle_durations.append(duration)
                previous_cycle = cycle

            # Calculer la moyenne des durées
            if cycle_durations:
                average_cycle_length = sum(cycle_durations) / len(cycle_durations)
            else:
                average_cycle_length = 28

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
    Ajoute un nouveau cycle menstruel avec une date de début et une date de fin.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            start_date_str = data.get('start_date')
            end_date_str = data.get('end_date')

            if not start_date_str:
                return JsonResponse({'error': 'La date de début est requise.'}, status=400)

            # Convertir la date de début
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            # Déterminer la date de fin
            if not end_date_str:
                end_date = start_date + timedelta(days=7)
            else:
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

            # Vérifier si un cycle existe déjà pour cette date
            if Cycle.objects.filter(start_date=start_date).exists():
                return JsonResponse({'error': 'Un cycle pour cette date existe déjà.'}, status=400)

            # Enregistrement du cycle dans la base de données
            cycle = Cycle(start_date=start_date, end_date=end_date)
            cycle.save()

            return JsonResponse({
                'message': 'Cycle ajouté avec succès !',
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }, status=201)

        except ValueError:
            return JsonResponse({'error': 'La date fournie est invalide.'}, status=400)
        except Exception as e:
            print("Erreur serveur :", str(e))
            return JsonResponse({'error': f"Erreur serveur : {str(e)}"}, status=500)
    else:
        return JsonResponse({'error': 'Méthode non autorisée.'}, status=405)


@csrf_exempt
def delete_cycle(request, cycle_id):
    """
    Supprime un cycle menstruel en fonction de son ID.
    """
    if request.method == 'DELETE':
        try:
            cycle = Cycle.objects.get(id=cycle_id)
            cycle.delete()

            # Retourne un message de succès avec un code 200 (OK)
            return JsonResponse({'message': 'Cycle supprimé avec succès'}, status=200)

        except Cycle.DoesNotExist:
            return JsonResponse({'error': 'Cycle non trouvé'}, status=404)

        except Exception as e:
            print(f"Erreur serveur : {str(e)}")
            return JsonResponse({'error': f"Erreur serveur : {str(e)}"}, status=500)

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


def get_cycles_data(request):
    """
    Retourne la durée entre chaque début de cycle (intervalle entre règles).
    """
    try:
        cycles = Cycle.objects.all().order_by('start_date')

        # Vérifier s'il y a au moins 2 cycles pour calculer l'intervalle
        if len(cycles) < 2:
            return JsonResponse({"cycles": []}, safe=False, status=200)

        data = []
        previous_cycle = None

        # Calcul de la durée entre chaque cycle
        for cycle in cycles:
            if previous_cycle:
                days_between = (cycle.start_date - previous_cycle.start_date).days
                data.append({
                    "start_date": cycle.start_date.strftime("%Y-%m-%d"),
                    "days_between": days_between
                })
            previous_cycle = cycle

        return JsonResponse({"cycles": data}, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
