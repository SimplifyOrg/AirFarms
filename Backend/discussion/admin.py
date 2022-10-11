from django.contrib import admin

# Register your models here.
from .models import CommentPicture, DiscussionBoard, Post, Comments, PostPicture

admin.site.register(DiscussionBoard)
admin.site.register(Post)
admin.site.register(Comments)
admin.site.register(CommentPicture)
admin.site.register(PostPicture)
