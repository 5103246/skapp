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
    path('courses/department/<str:department_name>/', views.CourseView.as_view(), name='course_list'),
    path('courses/create/', views.CourseView.as_view(), name='create_course'),
    path('courses/<int:course_id>/', views.CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:course_id>/reviews/', views.ReviewView.as_view(), name='course_review'),
    path('reviews/<int:review_id>/replies/', views.ReplyView.as_view(), name='reply_list_create'),
    path('reviews/<int:review_id>/', views.ReviewDetailView.as_view(), name='review_detail'),
    path('replies/<int:reply_id>/', views.ReplyDetailView.as_view(), name='reply_detail'),
    path('auth/user/', views.CurrentUserView.as_view(), name='current_user'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('users/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-route/', views.ProtectedRouteView.as_view(), name='protected_route'),
]