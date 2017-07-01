from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from colouring import views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^$', views.home, name='home'),
    url(r'^outlines/$', views.OutlinePictureList.as_view(), name='outline_pictures'),
    url(r'^outline_view/(?P<pk>\d+)/$', views.outline_view, name='outline_view'),
    url(r'^colouring/(?P<pk>\d+)/$', views.colouring_view, name='colouring_view'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
