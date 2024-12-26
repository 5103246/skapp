from rest_framework import serializers
from .models import User, Course, Review, Reply

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        # create_userを使用してパスワードをハッシュ化
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'course_name', 'professor_name', 'department']

class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'review_text', 'rating', 'author', 'created_at']
        read_only_fields = ['course', 'user']

    def create(self, validated_data):
        """
        Create a new Review instance with course and user provided via context.
        """
        """
        course = self.context.get('course')
        user = self.context.get('user')
        """
        validated_data['course'] = self.context['course']
        validated_data['user'] = self.context['user']
        return Review.objects.create(**validated_data)
    
class ReplySerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'reply_text', 'author', 'created_at']
        