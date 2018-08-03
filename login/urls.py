from django.conf.urls import url
from .views import UserLogin, UserRegister, UserLogout


urlpatterns = [
    url(r'register/$', UserRegister.as_view(), name='register'),
    url(r'login/$', UserLogin.as_view(), name='login'),
    url(r'logout/$', UserLogout.as_view(), name='logout'),
]