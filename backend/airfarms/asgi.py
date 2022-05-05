"""
ASGI config for airfarms project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airfarms.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from notifications import consumers

#application = get_asgi_application()

ws_pattern = [
    path('messaging/notification/<user_id>', consumers.NotificationCommunicator.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket" : AuthMiddlewareStack(URLRouter(
        ws_pattern
    ))
})
