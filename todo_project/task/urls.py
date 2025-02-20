from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserDetailView  # Ensure these exist
from .views import TaskViewSet

'''urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]'''

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),  # ✅ This includes all task-related endpoints
    path('register/', RegisterView.as_view(), name='register'),
]