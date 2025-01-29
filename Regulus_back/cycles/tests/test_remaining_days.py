import pytest
from django.urls import reverse
from datetime import date, datetime, timedelta
from cycles.models import Cycle


@pytest.mark.django_db
def test_remaining_days_with_user_input(client):
    url = reverse('get_remaining_days')
    response = client.get(f"{url}?start_date=2025-01-01")
    
    assert response.status_code == 200
    expected_days_remaining = (datetime(2025, 1, 29).date() - datetime.now().date()).days
    assert response.json()['days_remaining'] == max(0, expected_days_remaining)


@pytest.mark.django_db
def test_remaining_days_with_cycle_data(client):
    """
    Simuler un appel API pour récupérer les jours restants avec une date d'entrée
    """
    url = reverse('get_remaining_days')
    
    response = client.get(f"{url}?start_date=2024-01-01")
    assert response.status_code == 200
    
    # Calcul des jours restants pour le cycle 1
    expected_next_cycle_date = datetime(2024, 1, 29).date()
    expected_days_remaining = (expected_next_cycle_date - datetime.now().date()).days
    
    # Vérifier si la réponse de l'API contient les données attendues
    assert response.json()['days_remaining'] == max(0, expected_days_remaining)
    assert response.json()['next_cycle_date'] == expected_next_cycle_date.isoformat()


@pytest.mark.django_db
def test_remaining_days_without_cycle_data(client):
    """
    Test sans cycle, où l'API doit renvoyer la valeur par défaut (28 jours)
    """
    # Supprimer tous les cycles existants
    Cycle.objects.all().delete()

    url = reverse('get_remaining_days')
    
    response = client.get(f"{url}?start_date=2024-01-01")
    assert response.status_code == 200
    
    next_cycle_date = date(2024, 1, 29)
    days_remaining = (next_cycle_date - date.today()).days
    assert response.json()['days_remaining'] == max(0, days_remaining)
    assert response.json()['average_cycle_length'] == 28


@pytest.mark.django_db
def test_remaining_days_with_multiple_cycles(client):
    """
    Test avec plusieurs cycles et calcul de la moyenne des jours restants
    """
    cycle1 = Cycle.objects.create(start_date=date(2024, 1, 1), end_date=date(2024, 1, 28))
    cycle2 = Cycle.objects.create(start_date=date(2024, 2, 1), end_date=date(2024, 2, 28))
    cycle3 = Cycle.objects.create(start_date=date(2024, 3, 1), end_date=date(2024, 3, 28))
    
    url = reverse('get_remaining_days')
    response = client.get(f"{url}?start_date=2024-01-01")
    assert response.status_code == 200
    
    # Calcul des jours restants en fonction du cycle actuel
    average_cycle_length = (cycle1.duration() + cycle2.duration() + cycle3.duration()) / 3
    next_cycle_date = date(2024, 1, 1) + timedelta(days=average_cycle_length)
    today = date.today()
    days_remaining = max(0, (next_cycle_date - today).days)

    assert response.json()['days_remaining'] == days_remaining
    assert response.json()['average_cycle_length'] == average_cycle_length

@pytest.mark.django_db
def test_remaining_days_with_recorded_cycles(client):
    """
    Test basé sur les cycles enregistrés sans saisie manuelle.
    """
    Cycle.objects.create(start_date=date(2024, 1, 1), end_date=date(2024, 1, 28))
    Cycle.objects.create(start_date=date(2024, 2, 1), end_date=date(2024, 2, 28))
    
    url = reverse('get_remaining_days')
    response = client.get(url)
    assert response.status_code == 200
