from api.models import User, Profile, Follow
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, ProfileSerializer, FollowSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated


class MyTokenObtainPairView(TokenObtainPairView):
   serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserView(generics.ListAPIView):
   queryset = User.objects.all()
   serializer_class = UserSerializer

class UserDetail(generics.ListAPIView):
   serializer_class = UserSerializer
   queryset = User.objects.all()
   def get(self, request):
     return Response(self.get_serializer(request.user).data)
   
class FollowViewSet(viewsets.ModelViewSet):
   queryset = Follow.objects.all()
   serializer_class = FollowSerializer

   def create(self, request, *args, **kwargs):
      following_user_id = request.data.get('following_user_id')

      follower_user = self.request.user

      if Follow.objects.filter(follower=follower_user, following_id=following_user_id).exists():
         return Response({"detail": "Already following this user"}, status=status.HTTP_400_BAD_REQUEST)

      Follow.objects.create(follower=follower_user, following_id=following_user_id)

      return Response({"detail": "Successfully followed"}, status=status.HTTP_201_CREATED)




class ProfileCreateView(APIView):
   queryset = Profile.objects.all()
   serializer_class = ProfileSerializer

   def perform_create(self, serializer):
      serializer.save(user=self.request.user)
   
class ProfileUpdateView(generics.UpdateAPIView):

   queryset = Profile.objects.all()
   serializer_class = ProfileSerializer

   def perform_update(self, serializer):
         serializer.save(user=self.request.user);




@api_view(['GET'])
def get_routes(request):
   routes = [
       '/api/token',
       '/api/token/refresh'
   ]
   return Response(routes)
