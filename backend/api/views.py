from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

from .serializers import UserSerializer
from .serializers import NoteSerializer

class NoteListCreate(generics.ListCreateAPIView):
    """
    Here we are using ListCreateAPIView which will either
    return a list of all the notes or create new notes
    (exposes the GET and POST methods)
    """
    serializer_class = NoteSerializer
    
    # TODO: understand how the IsAuthenticated plays with the rest
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # We implement here a dedicated queryset, since we 
        # want to access the request object to be able to filter
        # the data by the currently logged in user
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
    
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
           
class CreateUserView(generics.CreateAPIView):
    """
    What we are doing here?
    * queryset: work on these objects
    * serializer class: the API shall be able to de/serialize this model
    * permission classes: everyone shall be allowed to access the create user api
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


