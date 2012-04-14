from django.conf.urls.defaults import *
from django.conf import settings
import views as views

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^Scheduler/', include('Scheduler.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),

    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT}),
    (r'^$', views.index),

    #Calander page
    (r'^calendar/$', views.view_calendar),
    (r'^calendar/(?P<instr>\w+)/$', views.view_calendar),
    (r'^logout/$', views.logout)
)
