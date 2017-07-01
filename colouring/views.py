import PIL
import base64
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model, login
from django.conf import settings
from django.views.generic import DetailView
from django.views.generic.edit import FormView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from .models import OutlinePicture
from .serializers import OutlinePictureSerializer
from .forms import UserSignupForm, ImageDataForm

User = get_user_model()


class OutlinePictureList(APIView):
    serializer_class = OutlinePictureSerializer
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'outlines.html'

    def get(self, request):
        queryset = OutlinePicture.objects.all()
        return Response({'outline_pictures': queryset})


def home(request):
    outline_pictures = OutlinePicture.objects.all()
    return render(request, 'home.html', {'outline_pictures': outline_pictures})


def outline_view(request, pk):
    outline_picture = OutlinePicture.objects.get(pk=pk)
    return render(request, 'outline_view.html', {'outline_picture': outline_picture})


def colouring_view(request, pk):
    outline_picture = OutlinePicture.objects.get(pk=pk)

    image_form = ImageDataForm()
    user_form = UserSignupForm()

    if request.method == 'POST':
        print(request.POST)
        user_form = UserSignupForm(request.POST)
        image_form = ImageDataForm(request.POST)
        if user_form.is_valid() and image_form.is_valid():
            first_name = user_form.cleaned_data['first_name']
            username = user_form.cleaned_data['username']
            email = user_form.cleaned_data['email']
            password = user_form.cleaned_data['password']
            user = User.objects.get_or_create(
                first_name=first_name,
                email=email,
                username=username,
                password=password
            )[0]
            user.set_password(user_form.cleaned_data['password'])
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            user.save()

            # log in the user again as editing password logs them out automatically
            username = user.username
            password = str(user_form.cleaned_data['password'])
            user = authenticate(username=username, password=password)
            login(request, user)

            image_form.create_picture_from_string(user)

        else:
            print('my errors', user_form.errors)

    return render(request, 'colouring_view.html', 
        {'outline_picture': outline_picture, 'user_form': user_form, 'image_form': image_form}
    )


class ColouringView(DetailView):
    template_name = 'colouring_view.html'
    form_class = UserSignupForm
    success_url = '/home/'
    queryset = OutlinePicture.objects.all()

    def get_context_data(self, **kwargs):
        context = super(ColouringView, self).get_context_data(**kwargs)
        context['outline_picture'] = OutlinePicture.objects.get(pk=self.kwargs.get('pk'))
        print('context is', context['outline_picture'])

    def form_valid(self, form):
        print(form)
        messages.info('You have saved a picture and signed up')
        return super(ColouringView, self).form_valid(form)


