"""
URL configuration for classapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('api/insert', views.insert_course),
    #path('api/get', views.get_course),
    #path('api/insert_review', views.insert_review),
    #path('api/get_review', views.get_review),
    path('courses/', views.CourseView.as_view(), name='course-list'),
    path('reviews/', views.ReviewView.as_view(), name='review-list'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-route/', views.ProtectedRouteView.as_view(), name='protected_route'),
    path('', views.index),
]
