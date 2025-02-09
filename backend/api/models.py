from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    
    # we do not want to pass it but to create it everytime
    # we create a new instance of this model object
    created_at = models.DateTimeField(auto_now_add=True)

    # This is the place where we link the user and its notes
    # * User: the object (table) to be linked to
    # * on_delete=CASCADE : when the corresponding user is deleted, also all notes
    #         that are linked to this user shall be deleted
    # * related_names: the user is able to access its notes using the .notes field
    #         notation 
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    
    def __str__(self):
        return self.title
    
