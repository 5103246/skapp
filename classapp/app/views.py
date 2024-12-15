from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from app.models import User, Course, Review
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, CourseSerializer, ReviewSerializer

# Create your views here.
def index(request):
    context = {}
    return render(request, "app/index.html", context)

#@api_view(['POST'])
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProtectedRouteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message":f"Hello, {request.user.username}. This is a protected route."})

class CourseView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        courses = Course.objects.order_by("-id")
        serializer = CourseSerializer(courses, many=True)
        return Response({"result": serializer.data})
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewView(APIView):
    def get(self, request):
        reviews = Review.objects.order_by("-id")
        serializer = ReviewSerializer(reviews, many=True)
        return Response({"result": serializer.data})
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)