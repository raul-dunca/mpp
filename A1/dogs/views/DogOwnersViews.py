from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from dogs.models import DogOwner, Owner
from dogs.serializers import DogOwnerSerializer, DogOwnersSerializerDetails


class MyPagination(PageNumberPagination):
    #page_size = 10
    page_size_query_param = 'page_size'
    #max_page_size = 10
    page_query_param = 'p'

class DogOwnersList(APIView):

    @extend_schema(request=None,responses=DogOwnerSerializer)
    def get(self,request):
        dogowners = DogOwner.objects.all()
        paginator = MyPagination()
        paginated_dogowners = paginator.paginate_queryset(dogowners, request)
        serializer = DogOwnerSerializer(paginated_dogowners, many=True)
        return paginator.get_paginated_response(serializer.data)

    @extend_schema(request=None,responses=DogOwnerSerializer)
    def post(self,request):
        serializer = DogOwnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class DogOwnersDetails(APIView):

    def get_object(self,id_dog,id_owner):
        try:
            return  DogOwner.objects.get(dog=id_dog,owner=id_owner)
        except Owner.DoesNotExist:
            raise Http404

    @extend_schema(request=None,responses=DogOwnersSerializerDetails)
    def get(self,request, id_dog,id_owner):
        dogowner = self.get_object(id_dog,id_owner)
        serializer = DogOwnersSerializerDetails(dogowner)
        return Response(serializer.data)

    @extend_schema(request=None,responses=DogOwnerSerializer)
    def put(self, request, id_dog,id_owner):
        dogowner = self.get_object(id_dog,id_owner)
        serializer = DogOwnerSerializer(dogowner, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None,responses=DogOwnerSerializer)
    def delete(self, request, id_dog,id_owner):
        dogowner = self.get_object(id_dog,id_owner)
        dogowner.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)