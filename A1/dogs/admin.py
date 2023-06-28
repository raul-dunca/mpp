from django.contrib import admin
from .models import Dog, DogOwner
from .models import Toy
from .models import Owner

#NOT MANDATORY

admin.site.register(Dog)
admin.site.register(Toy)
admin.site.register(Owner)
admin.site.register(DogOwner)
