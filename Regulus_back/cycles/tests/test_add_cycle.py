import json
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
from django.test import Client
from django.http import JsonResponse
from cycles.views import add_cycle


class AddCycleTestCase(unittest.TestCase):
    def setUp(self):
        self.client = Client()
        # Date valide
        self.valid_date = "2024-01-01"
        # Date invalide
        self.invalid_date = "2024-99-99"
        # Pour simuler un doublon
        self.existing_date = (datetime.today() - timedelta(days=10)).strftime("%Y-%m-%d")  


    @patch('cycles.views.Cycle')
    def test_add_valid_cycle(self, mock_cycle):
        """
        Teste l'ajout d'un cycle valide.
        """
        mock_cycle.objects.filter.return_value.exists.return_value = False
        mock_instance = MagicMock()
        mock_instance.start_date = datetime.strptime(self.valid_date, "%Y-%m-%d").date()
        mock_instance.end_date = mock_instance.start_date + timedelta(days=28)

        mock_cycle.return_value = mock_instance

        response = self.client.post(
            "/api/add_cycle/",
            json.dumps({"start_date": self.valid_date}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn("Cycle ajouté avec succès", response.json()["message"])


    @patch('cycles.views.Cycle.objects')
    def test_add_cycle_missing_date(self, mock_cycle_objects):
        """
        Teste l'ajout sans date (doit renvoyer une erreur).
        """
        response = self.client.post(
            "/api/add_cycle/",
            json.dumps({}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "La date de début est requise.")


    @patch('cycles.views.Cycle.objects')
    def test_add_cycle_invalid_date_format(self, mock_cycle_objects):
        """
        Teste l'ajout d'un cycle avec une date invalide.
        """
        response = self.client.post(
            "/api/add_cycle/",
            json.dumps({"start_date": self.invalid_date}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "La date fournie est invalide.")


    @patch('cycles.views.Cycle.objects')
    def test_add_cycle_duplicate_date(self, mock_cycle_objects):
        """
        Teste l'ajout d'un cycle déjà existant.
        """
        mock_cycle_objects.filter.return_value.exists.return_value = True

        response = self.client.post(
            "/api/add_cycle/",
            json.dumps({"start_date": self.existing_date}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "Un cycle pour cette date existe déjà.")


    @patch('cycles.views.Cycle.objects')
    def test_add_cycle_internal_server_error(self, mock_cycle_objects):
        """
        Teste la gestion d'une erreur serveur.
        """
        mock_cycle_objects.filter.side_effect = Exception("Erreur inattendue")

        response = self.client.post(
            "/api/add_cycle/",
            json.dumps({"start_date": self.valid_date}),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn("Erreur serveur", response.json()["error"])


if __name__ == "__main__":
    unittest.main()
