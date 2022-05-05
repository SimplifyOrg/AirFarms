from django.apps import AppConfig#, apps

class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dashboard'

    #def ready(self):
    #    from actstream import registry
    #    registry.register(
    #                        apps.get_model(app_label = 'accounts', model_name = 'User'),
    #                        apps.get_model(app_label = 'farms', model_name = 'Farm'),
    #                        apps.get_model(app_label = 'farms', model_name = 'Subscription')
    #                    )
