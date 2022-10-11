from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from .models import CommentPicture, DiscussionBoard, Post, Comments, PostPicture
from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import FormParser
from .serializers import CommentListSerializer, CommentPictureSerializer, CreatePostSerializer, CreateCommentSerializer, CommentSerializer, DiscussionBoardSerializer, PostListSerializer, PostPictureSerializer, PostSerializer, UpdateCommentSerializer, UpdatePostSerializer
from rest_framework.response import Response

class PostView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = PostSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "post": PostSerializer(user, context=self.get_serializer_context()).data
        })

class CreatePostView(generics.GenericAPIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        newPost = CreatePostSerializer(data=request.data, user=request.user)
        if newPost.is_valid(raise_exception=True):
            newPost.save()
            return Response({
                'status' : True,
                'detail' : 'Post created',
                'post' : newPost.instance.id
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(newPost.errors)

class PostUserWritePermission(permissions.BasePermission):
    #message = 'Editing posts is restricted to the author only.'

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class PostPermissionView(generics.GenericAPIView, PostUserWritePermission):

    permission_classes = [
        permissions.IsAuthenticated,
        PostUserWritePermission
    ]

    queryset = Post.objects.all()
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response({
                'status' : True,
                'detail' : 'Post editable'
            })

class UpdatePostView(generics.RetrieveUpdateDestroyAPIView, PostUserWritePermission):

    permission_classes = [
        permissions.IsAuthenticated,
        PostUserWritePermission
    ]

    queryset = Post.objects.all()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UpdatePostSerializer(data=request.data, user=request.user)
        if serializer.is_valid(raise_exception=True):
            instance.user = request.user
            instance.description = serializer.validated_data['description']
            instance.tags = serializer.validated_data['tags']
            instance.save()
            #self.perform_update(serializer)
            return Response({
                'status' : True,
                'detail' : 'Post updated'
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(serializer.errors)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
           instance.delete()
           return Response({
                'status' : True,
                'detail' : 'Post deleted'
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(instance.errors)

class PostListView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = PostListSerializer

    def post(self, request, *args, **kwargs):
        discussionBoard = DiscussionBoard.objects.filter(id=int(request.data['discussion'])).get()
        serializer = PostListSerializer(data=request.data, user=request.user, discussion=discussionBoard)
        serializer.is_valid(raise_exception=True)
        posts = serializer.validated_data
        return Response({
            "posts": posts.values()
        })

class PostPictureViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = PostPicture.objects.all()
    serializer_class = PostPictureSerializer


class DiscussionBoardViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = DiscussionBoard.objects.all()
    serializer_class = DiscussionBoardSerializer



class CreateCommentView(generics.GenericAPIView):
	permission_classes = [
        permissions.IsAuthenticated,
    ]

	def post(self, request, *args, **kwargs):
		post = Post.objects.filter(id=int(request.data['post'])).get()
		newComment = CreateCommentSerializer(data=request.data, user=request.user, post=post)
		if newComment.is_valid(raise_exception=True):
			newComment.save()
			return Response({
                'status' : True,
                'detail' : 'Comment created',
                'comment' : newComment.instance.id
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
		return Response(newComment.errors)

class CommentUserWritePermission(permissions.BasePermission):
    #message = 'Editing comments is restricted to the author only.'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class UpdateCommentView(generics.RetrieveUpdateDestroyAPIView, CommentUserWritePermission):

    permission_classes = [
        permissions.IsAuthenticated,
        CommentUserWritePermission
    ]

    queryset = Comments.objects.all()

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UpdateCommentSerializer(data=request.data, user=request.user, post=Post.objects.get(id=int(request.data['post'])))
        if serializer.is_valid(raise_exception=True):
            instance.user = request.user
            instance.comment = serializer.validated_data['comment']
            instance.save()
            return Response({
                'status' : True,
                'detail' : 'Comment updated'
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(serializer.errors)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
           instance.delete()
           return Response({
                'status' : True,
                'detail' : 'Comment deleted'
            },
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type'
            })
        return Response(instance.errors)


class CommentView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = CommentListSerializer

    def post(self, request, *args, **kwargs):
        post = Post.objects.filter(id=int(request.data['post'])).get()
        serializer = CommentListSerializer(data=request.data, user=request.user, post=post)
        serializer.is_valid(raise_exception=True)
        comments = serializer.validated_data
        return Response({
            "comments": comments.values()
        })

class CommentPictureViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = CommentPicture.objects.all()
    serializer_class = CommentPictureSerializer
