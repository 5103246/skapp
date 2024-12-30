from django.shortcuts import render
#import json
#from django.http import JsonResponse
#from django.views.decorators.csrf import csrf_exempt
from app.models import User, Course, Review, Reply
from rest_framework.views import APIView
#from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, CourseSerializer, ReviewSerializer, ReplySerializer
from rest_framework.permissions import AllowAny
#from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class RegisterView(APIView):
    permission_classes = [AllowAny]  # 認証不要に設定
    
    def post(self, request):
        logger.debug(f"Request data: {request.data}")
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "id": user.id, 
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProtectedRouteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message":f"Hello, {request.user.username}. This is a protected route."})

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            serializer = CourseSerializer(course)
            reviews = Review.objects.filter(course=course).order_by("created_at")
            review_serializer = ReviewSerializer(reviews, many=True)
            
            return Response({
                "course": serializer.data,
                "reviews": review_serializer.data,
            })
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

class CourseView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, department_name):
        courses = Course.objects.filter(department=department_name).order_by("-id")
        serializer = CourseSerializer(courses, many=True)
        return Response({"result": serializer.data})
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        reviews = Review.objects.order_by("-id")
        serializer = ReviewSerializer(reviews, many=True)
        return Response({"result": serializer.data})
    
    def post(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReviewSerializer(
            data=request.data,
            context={'course': course, 'user': request.user}
            )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReplyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, review_id):
        """特定の感想に紐づく返信を取得"""
        replies = Reply.objects.filter(review_id=review_id).order_by("created_at")
        serializer = ReplySerializer(replies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, review_id):
        """返信を投稿"""
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({"error": "指定された感想が見つかりません。"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, review=review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)