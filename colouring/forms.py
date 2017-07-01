import base64
from django import forms
from django.conf import settings
from .models import OutlinePicture, ColourPicture


class UserSignupForm(forms.Form):
    first_name = forms.CharField(max_length=30)
    username = forms.CharField(max_length=30)
    email = forms.EmailField(max_length=255)
    password = forms.CharField(max_length=30, widget=forms.PasswordInput)


class ImageDataForm(forms.Form):
    image_name = forms.CharField(max_length=70, required=False)
    image_string = forms.CharField()
    outline = forms.ModelChoiceField(queryset=OutlinePicture.objects.all())

    def create_picture_from_string(self, user):
        """
        The HTML Canvas image has been converted to a string and submitted in a form 
        (Django FileField upload does not work here as the file bitmap has been edited 
        but not saved as a new file yet.) This method decodes the image string, 
        saves it as a jpg and creates a ColourPicture object.
        """
        image_name = self.cleaned_data['image_name']
        image_string = self.cleaned_data['image_string'][22:]
        decoded64 = base64.b64decode(image_string)
        picture_file = open('media/colourings/{}.jpg'.format(image_name), 'wb')
        picture_file.write(decoded64)
        picture_file.close()
        ColourPicture.objects.create(
            name='testing',
            owner=user,
            image='colourings/{}.jpg'.format(image_name),
            outline=self.cleaned_data['outline']
        )


