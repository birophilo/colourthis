from rest_framework import serializers
from .models import OutlinePicture


class OutlinePictureSerializer(serializers.ModelSerializer):
 #   owner = serializers.ReadOnlyField(source='owner.username') 

    class Meta:
        model = OutlinePicture
        fields = ('name', 'description', 'image', 'public_visibility', 'created_at', 'owner')