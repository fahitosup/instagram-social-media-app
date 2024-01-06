from django.urls import path, include
from . import views
from rest_framework import routers
from .views import MyTokenObtainPairView, RegisterView, UserView, UserDetail, ProfileCreateView, ProfileUpdateView, FollowViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'', views.FollowViewSet)

urlpatterns = [
    path('', views.get_routes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register', RegisterView.as_view(), name='auth_register'),
    path('register/create-profile', ProfileCreateView.as_view(), name='create_profile'),
    path('register/update-profile/<int:pk>/', ProfileUpdateView.as_view(), name='profile-update'),
    path('user', UserDetail.as_view(), name='user' ),
    path('users', UserView.as_view(), name='user' ),
    path('follows', include(router.urls))
]