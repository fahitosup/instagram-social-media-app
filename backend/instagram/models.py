from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from datetime import datetime
# Create your models here.

class Instagram(models.Model):
    userId = models.CharField(max_length=255)
    caption = models.TextField()
    link = models.ImageField(upload_to='images')
    likes = models.IntegerField()
    time = models.DateTimeField(default=datetime.now)

