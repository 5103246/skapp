from rest_framework import serializers
from .models import User, Course, Review, Reply
from rest_framework.exceptions import ValidationError

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
    author_name = serializers.CharField(source='user.username', read_only=True)
    author_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'review_text', 'rating', 'author_id', 'author_name', 'created_at']
        read_only_fields = ['course', 'user']
        
    def validate(self, data):
        user = self.context.get('user')
        course = self.context.get('course')
        # 編集の場合はcourseを必須にしない
        if self.instance is None and not course:
            raise ValidationError("Course is required.")

        # 新規作成時のみ、既存レビューをチェック
        if not self.instance and Review.objects.filter(course=course, user=user).exists():
            raise ValidationError("この授業に対する感想と評価は既に投稿済みです。")
        # 下のコードが原因で、感想を編集するときに、400エラーが起きた。編集送信の際、courseが含まれていなかったためエラーが起きた。
        """
        if not course:
            raise ValidationError("Course is required.")
        
        # ユーザーがすでにレビューを投稿しているか確認
        if Review.objects.filter(course=course, user=user).exists():
            raise ValidationError("この授業に対する感想と評価は既に投稿済みです。")"""
        return data

    def create(self, validated_data):
        #Create a new Review instance with course and user provided via context.
        #course = self.context.get('course')
        #user = self.context.get('user')
       
        validated_data['course'] = self.context['course']
        validated_data['user'] = self.context['user']
        return Review.objects.create(**validated_data)
    
class ReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='user.username', read_only=True)
    author_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'reply_text', 'author_id', 'author_name', 'created_at']
        