from django.db import models
from accounts.models import User
from django.urls import reverse
from django.utils import timezone

class DiscussionBoard(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=256, default='Discussion Board')

class Post(models.Model):
	id = models.AutoField(primary_key=True)
	description = models.TextField(blank=True)
	date_posted = models.DateTimeField(default=timezone.now)
	tags = models.CharField(max_length=100, blank=True)
	user = models.ForeignKey(User, related_name='post_user', on_delete=models.CASCADE)
	discussion = models.ForeignKey(DiscussionBoard, on_delete=models.CASCADE)

	def __str__(self):
		return self.description

	def get_absolute_url(self):
		return reverse('post-detail', kwargs={'pk': self.pk})

class PostPicture(models.Model):
    post = models.ForeignKey(Post, related_name='post_picture', on_delete=models.CASCADE)
    pic = models.ImageField(blank=True, upload_to='posts')

class Comments(models.Model):
	id = models.AutoField(primary_key=True) 
	post = models.ForeignKey(Post, related_name='details', on_delete=models.CASCADE)
	user = models.ForeignKey(User, related_name='comment_user', on_delete=models.CASCADE)
	comment = models.TextField()
	comment_date = models.DateTimeField(default=timezone.now)

	def __str__(self):
		return self.comment

class CommentPicture(models.Model):
    comment = models.ForeignKey(Comments, on_delete=models.CASCADE)
    pic = models.ImageField( upload_to='posts')

class Like(models.Model):
	user = models.ForeignKey(User, related_name='like_user', on_delete=models.CASCADE)
	post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)

class DisLike(models.Model):
	user = models.ForeignKey(User, related_name='dislike_user', on_delete=models.CASCADE)
	post = models.ForeignKey(Post, related_name='dislikes', on_delete=models.CASCADE)
