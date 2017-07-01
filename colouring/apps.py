from django.apps import AppConfig


class ColouringConfig(AppConfig):
    name = 'colouring'

    def ready(self):
        import colouring.signals
