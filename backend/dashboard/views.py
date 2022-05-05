from django.shortcuts import get_object_or_404, render, redirect
#from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.contrib import messages
from django.core.paginator import Paginator
from accounts import serializers
from accounts.models import User
from farms.models import Farm, Subscription
from django.http.multipartparser import MultiPartParser
from django.views.generic import ListView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import CommentPicture, DisLike, DiscussionBoard, Post, Comments, Like, PostPicture
from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import FormParser
from .serializers import CommentListSerializer, CommentPictureSerializer, CreatePostSerializer, CreateCommentSerializer, CommentSerializer, DiscussionBoardSerializer, PostListSerializer, PostPictureSerializer, PostSerializer, UpdateCommentSerializer, UpdatePostSerializer
from rest_framework.response import Response
import json

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


# class PostListView(ListView):
# 	model = Post
# 	template_name = 'home/feed/home.html'
# 	context_object_name = 'posts'
# 	ordering = ['-date_posted']
# 	paginate_by = 10
# 	def get_context_data(self, **kwargs):
# 		context = super(PostListView, self).get_context_data(**kwargs)
# 		if self.request.user.is_authenticated:
# 			liked = [i for i in Post.objects.all() if Like.objects.filter(user = self.request.user, post=i)]
# 			context['liked_post'] = liked
# 		return context

# class UserPostListView(LoginRequiredMixin, ListView):
# 	model = Post
# 	template_name = 'home/feed/user_posts.html'
# 	context_object_name = 'posts'
# 	paginate_by = 10

# 	def get_context_data(self, **kwargs):
# 		context = super(UserPostListView, self).get_context_data(**kwargs)
# 		user = get_object_or_404(User, username=self.kwargs.get('username'))
# 		liked = [i for i in Post.objects.filter(user_name=user) if Like.objects.filter(user = self.request.user, post=i)]
# 		context['liked_post'] = liked
# 		return context

# 	def get_queryset(self):
# 		user = get_object_or_404(User, username=self.kwargs.get('username'))
# 		return Post.objects.filter(user_name=user).order_by('-date_posted')


# @login_required
# def post_detail(request, pk):
# 	post = get_object_or_404(Post, pk=pk)
# 	user = request.user
# 	is_liked =  Like.objects.filter(user=user, post=post)
# 	if request.method == 'POST':
# 		form = NewCommentForm(request.POST)
# 		if form.is_valid():
# 			data = form.save(commit=False)
# 			data.post = post
# 			data.username = user
# 			data.save()
# 			return redirect('post-detail', pk=pk)
# 	else:
# 		form = NewCommentForm()
# 	return render(request, 'home/feed/post_detail.html', {'post':post, 'is_liked':is_liked, 'form':form})

# @login_required
# def create_post(request):
# 	user = request.user
# 	if request.method == "POST":
# 		form = NewPostForm(request.POST, request.FILES, user=request.user)
# 		if form.is_valid():
# 			data = form.save(commit=False)
# 			data.user_name = user
# 			data.save()
# 			messages.success(request, f'Posted Successfully')
# 			return redirect('home')
# 	else:
# 		form = NewPostForm(user=request.user)
# 	return render(request, 'home/feed/create_post.html', {'form':form})

# @login_required
# def load_subscriptions(request):
# 	farm_id = request.GET.get('farm_id')
# 	subscriptions = Subscription.objects.filter(farm_id=farm_id)
# 	return render(request, 'home/feed/subscription_options.html', {'subscriptions': subscriptions})

# class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
# 	model = Post
# 	fields = ['description', 'pic', 'tags']
# 	template_name = 'home/feed/create_post.html'

# 	def form_valid(self, form):
# 		form.instance.user_name = self.request.user
# 		return super().form_valid(form)

# 	def test_func(self):
# 		post = self.get_object()
# 		if self.request.user == post.user_name:
# 			return True
# 		return False

# @login_required
# def post_delete(request, pk):
# 	post = Post.objects.get(pk=pk)
# 	if request.user== post.user_name:
# 		Post.objects.get(pk=pk).delete()
# 	return redirect('home')


# @login_required
# def search_posts(request):
# 	query = request.GET.get('p')
# 	object_list = Post.objects.filter(tags__icontains=query)
# 	liked = [i for i in object_list if Like.objects.filter(user = request.user, post=i)]
# 	context ={
# 		'posts': object_list,
# 		'liked_post': liked
# 	}
# 	return render(request, "home/feed/search_posts.html", context)

# @login_required
# def like(request):
# 	post_id = request.GET.get("likeId", "")
# 	user = request.user
# 	post = Post.objects.get(pk=post_id)
# 	liked= False
# 	like = Like.objects.filter(user=user, post=post)
# 	if like:
# 		like.delete()
# 	else:
# 		liked = True
# 		Like.objects.create(user=user, post=post)
# 	resp = {
#         'liked':liked
#     }
# 	response = json.dumps(resp)
# 	return HttpResponse(response, content_type = "application/json")

# @login_required
# def dislike(request):
# 	post_id = request.GET.get("dislikeId", "")
# 	user = request.user
# 	post = Post.objects.get(pk=post_id)
# 	disliked= False
# 	dislike = Like.objects.filter(user=user, post=post)
# 	if dislike:
# 		dislike.delete()
# 	else:
# 		disliked = True
# 		DisLike.objects.create(user=user, post=post)
# 	resp = {
#         'disliked':disliked
#     }
# 	response = json.dumps(resp)
# 	return HttpResponse(response, content_type = "application/json")
