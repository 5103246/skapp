from django.shortcuts import render
from app.models import User, Course, Review, Reply
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, CourseSerializer, ReviewSerializer, ReplySerializer
from rest_framework.permissions import AllowAny
#from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_verification_email, verify_email_verification_token
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

class RegisterView(APIView):
    permission_classes = [AllowAny]  # 認証不要に設定
    
    def post(self, request):
        logger.debug(f"Request data: {request.data}")
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            # Gmail APIを使用して確認メールを送信
            send_verification_email(user, request)
            #refresh = RefreshToken.for_user(user)
            return Response({
                "message": "確認メールを送信しました。", 
                "email": user.email,
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        email = verify_email_verification_token(token)

        if email is None:
            return Response({"error": "無効なまたは期限切れのトークンです。"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if user.is_active:
                return Response({"message": "既に確認済みのメールアドレスです。"}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()
            return Response({"message": "アカウントが有効化されました。"}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "ユーザーが存在しません。"}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.debug(f"Login request data: {request.data}")
        email = request.data.get("email")
        password = request.data.get("password")
        logger.debug(f"Received email: {email}, password: {password}")
        
        if not email or not password:
            return Response({"error": "メールアドレスとパスワードを入力してください。"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is None:
            logger.debug("Authentication failed")
            return Response({"error": "メールアドレスまたはパスワードが間違っています。"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "メールアドレスが確認されていません。"}, status=status.HTTP_403_FORBIDDEN)

        logger.debug("Authentication successful")
        refresh = RefreshToken.for_user(user)
        return Response({
            "id": user.id,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)

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
    
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
        except:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        reviews = Review.objects.filter(course=course).order_by("-id")
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

class ReviewDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, review_id):
        """特定の感想に紐づく返信を取得"""
        review = Review.objects.filter(id=review_id)
        serializer = ReviewSerializer(review, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, review_id):
        
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({"error": "Review not found or you do not have permission to edit it."}, status=404)
        print(request.data)
        serializer = ReviewSerializer(review, data=request.data, partial=True, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response({"message": "Review deleted successfully."}, status=204)
        except Review.DoesNotExist:
            return Response({"error": "Review not found or you do not have permission to delete it."}, status=404)

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
    
class ReplyDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, reply_id):
        try:
            reply = Reply.objects.get(id=reply_id, user=request.user)
        except Reply.DoesNotExist:
            return Response({"error": "Reply not found or you do not have permission to edit it."}, status=404)
        
        serializer = ReplySerializer(reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, reply_id):
        try:
            reply = Reply.objects.get(id=reply_id, user=request.user)
            reply.delete()
            return Response({"message": "Reply deleted successfully."}, status=204)
        except Review.DoesNotExist:
            return Response({"error": "Reply not found or you do not have permission to delete it."}, status=404)