from django.contrib import admin
from .models import CommentPicture, DiscussionBoard, Post, Comments, Like, PostPicture

admin.site.register(DiscussionBoard)
admin.site.register(Post)
admin.site.register(Comments)
admin.site.register(Like)
admin.site.register(CommentPicture)
admin.site.register(PostPicture)
