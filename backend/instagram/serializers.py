from rest_framework import serializers
from .models import Instagram


class InstagramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instagram
        fields = '__all__'

