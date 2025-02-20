from django.db import models
from django.contrib.auth.models import User

class Task (models.Model):
    objects = None
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='Low')
    user = models.ForeignKey(User, related_name='tasks', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
