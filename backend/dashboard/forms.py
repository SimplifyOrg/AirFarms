from django import forms
from .models import Comments, Post
from farms.models import Farm, Subscription

# class NewPostForm(forms.ModelForm):
# 	class Meta:
# 		model = Post
# 		fields = ['description', 'pic', 'tags']

# 	def __init__(self, *args, **kwargs):
# 		user = kwargs.pop('user')
# 		super(NewPostForm, self).__init__(*args, **kwargs)
# 		if user:
# 			self.fields['farm'].queryset = Farm.objects.filter(user=user)
# 			self.fields['subscription'].queryset = Subscription.objects.none()

# 		if 'farm' in self.data:
# 			try:
# 				farm_id = int(self.data.get('farm'))
# 				self.fields['subscription'].queryset = Subscription.objects.filter(farm_id=farm_id).order_by('name')
# 			except (ValueError, TypeError):
# 				pass  # invalid input from the client; ignore and fallback to empty City queryset
# 		elif self.instance.pk:
# 			self.fields['subscription'].queryset = self.instance.farm.subscription_set.order_by('name')

# class NewCommentForm(forms.ModelForm):

# 	class Meta:
# 		model = Comments
# 		fields = ['comment']
