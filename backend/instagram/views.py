from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from .models import Instagram
from .serializers import InstagramSerializer

class PostListCreateView(viewsets.ModelViewSet):
    serializer_class = InstagramSerializer
    queryset = Instagram.objects.all().order_by('-time')



