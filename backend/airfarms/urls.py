"""airfarms URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar

urlpatterns = [
    path('', include('home.urls', namespace='home')),
    path('activity/', include('dashboard.urls')),
    path('perform/', include('todo.urls')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('farm/', include('farms.urls')),
    path('farm-maps/', include('mapfarm.urls')),
    path('projects/', include('project.urls')),
    path('todos/', include('todo.urls')),
    path('process/', include('workflow.urls')),
    path('admin/', admin.site.urls),
    path('accounts/default/', include('allauth.account.urls')),
    path('accounts/social/', include('allauth.socialaccount.providers.google.urls')),
    #path('activity/', include('actstream.urls')),
    #path('accounts/default/', include('django.contrib.auth.urls')),
    #path('__debug__/', include(debug_toolbar.urls)),
]

# if settings.DEBUG:
    #urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    #urlpatterns += path('__debug__/', include(debug_toolbar.urls))
