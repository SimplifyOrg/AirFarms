from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.contrib import messages
from django.core.paginator import Paginator
from rest_framework import viewsets, permissions
from accounts.models import User
from farms.serializers import FarmDiscussionBoardSerializer, FarmPictureSerializer, FarmSerializer
from .forms import NewFarm, NewSubscription
from django.views.generic import ListView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Farm, FarmDiscussionBoard, FarmPicture, Subscription, FarmFollowers
from dashboard.models import Like, Post
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from mapfarm import views
import json

class FarmViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    #queryset = Farm.objects.all()
    serializer_class = FarmSerializer

    def get_queryset(self):
        return Farm.objects.filter(user_id=self.request.user.id)


class FarmPictureViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = FarmPicture.objects.all()
    serializer_class = FarmPictureSerializer
    lookup_field = 'farm_id'

    def retrieve(self, request, *args, **kwargs):
        farm_id = kwargs.get('farm_id', None)
        farm_obj = Farm.objects.get(id=farm_id)
        self.queryset = FarmPicture.objects.filter(farm=farm_obj).distinct()
        return super(FarmPictureViewSet, self).retrieve(request, *args, **kwargs)

class FarmDiscussionBoardViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    #parser_classes = (MultiPartParser, FormParser)
    queryset = FarmDiscussionBoard.objects.all()
    serializer_class = FarmDiscussionBoardSerializer
    lookup_field = 'farm'

class FarmListView(ListView):
	model = Farm
	template_name = 'home/farms/home.html'
	context_object_name = 'farms'
	ordering = ['-date_created']
	paginate_by = 10

	def get_context_data(self, **kwargs):
		context = super(FarmListView, self).get_context_data(**kwargs)
		#if self.request.user.is_authenticated:
		#	liked = [i for i in Farm.objects.all() if Farm.objects.filter(user = self.request.user)]
		#	context['owned_farms'] = liked
		return context

	def get_queryset(self, *args, **kwargs):
		farms = super(FarmListView, self).get_queryset(*args, **kwargs)
		#user = get_object_or_404(Farm, username=self.kwargs.get('username'))
		return farms.order_by('-date_created')

class SubscriptionListView(LoginRequiredMixin, ListView):
	model = Subscription
	template_name = 'home/farms/subscriptions_page.html'
	context_object_name = 'subscriptions'
	paginate_by = 10

	def get_context_data(self, **kwargs):
		context = super(SubscriptionListView, self).get_context_data(**kwargs)
		farm_obj = get_object_or_404(Farm, farm=self.kwargs.get('farm'))
		
		liked = [i for i in Post.objects.filter(farm=farm_obj) if Like.objects.filter(farm = self.request.farm, post=i)]
		context['liked_post'] = liked
		return context

	def get_queryset(self):
		farm_obj = get_object_or_404(Farm, farm=self.kwargs.get('farm'))
		return Post.objects.filter(farm=farm_obj).order_by('-date_posted')

@login_required
def ViewFarmProfile(request):
    args = {'farm': request.farm}
    return render(request, 'home/account/farm_profile.html', args)

@login_required
def FollowFarm(request, pk):
	farm = get_object_or_404(Farm, pk=pk)
	user = request.user
	if request.method == 'POST':
		FarmFollowers.objects.create(farm=farm,
                             follower=request.user)

@login_required
def post_detail_farm(request, pk):
	farm = get_object_or_404(Farm, pk=pk)
	user = request.user
	#is_liked =  Like.objects.filter(farm=farm)
	if request.method == 'POST':
		form = NewFarm(request.POST)
		if form.is_valid():
			data = form.save(commit=False)
			data.farm = farm
			data.username = user
			data.save()
			return redirect('farm-detail', pk=pk)
	else:
		form = NewFarm()
	return render(request, 'home/farms/farm_detail.html', {'farm':farm, 'form':form})

@login_required
def create_farm(request):
	user = request.user
	if request.method == "POST":
		form = NewFarm(request.POST, request.FILES)
		if form.is_valid():
			data = form.save(commit=False)
			data.user = user
			data.save()
			messages.success(request, f'Posted Successfully')
			return HttpResponseRedirect(reverse('mapfarm:farm-map', kwargs={'pk': data.id}))
			#return redirect('mapfarm:farm-map', pk=[data.id])
	else:
		form = NewFarm()
	return render(request, 'home/farms/create_farm.html', {'form':form})

class FarmUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
	model = Farm
	fields = ['description', 'pic', 'tags']
	template_name = 'home/Farm/create_farm.html'

	def form_valid(self, form):
		form.instance.user = self.request.user
		return super().form_valid(form)

	def test_func(self):
		post = self.get_object()
		if self.request.user == post.user:
			return True
		return False

@login_required
def farm_delete(request, pk):
	farm = Farm.objects.get(pk=pk)
	if request.user== farm.user:
		Post.objects.get(pk=pk).delete()
	return redirect('home')


@login_required
def search_farms(request):
	query = request.GET.get('p')
	object_list = Farm.objects.filter(tags__icontains=query)
	liked = [i for i in object_list if Like.objects.filter(user = request.user, post=i)]
	context ={
		'farms': object_list,
		'liked_post': liked
	}
	return render(request, "home/farms/search_posts.html", context)

@login_required
def like(request, pk):
	farm = get_object_or_404(Farm, pk=pk)
	post_id = request.GET.get("likeId", "")
	user = request.user
	post = Farm.objects.get(pk=post_id)
	liked= False
	like = Like.objects.filter(user=user, farm=farm)
	if like:
		like.delete()
	else:
		liked = True
		Like.objects.create(user=user, farm=farm)
	resp = {
        'liked':liked
    }
	response = json.dumps(resp)
	return HttpResponse(response, content_type = "application/json")
