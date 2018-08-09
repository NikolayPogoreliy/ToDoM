from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.views.generic.edit import FormView, View
from django.http import HttpResponseRedirect
# Create your views here.


class UserRegister(FormView):
    form_class = UserCreationForm
    success_url = '/login/'
    template_name = 'register.html'

    def form_valid(self, form):
        form.save()
        return super(UserRegister, self).form_valid(form)


class UserLogin(FormView):
    form_class = AuthenticationForm
    template_name = 'login.html'
    success_url = '/'

    def form_valid(self, form):
        self.user = form.get_user()
        login(self.request, self.user)
        return super(UserLogin, self).form_valid(form)


class UserLogout(View):

    @staticmethod
    def get(request):
        logout(request)
        return HttpResponseRedirect("/")