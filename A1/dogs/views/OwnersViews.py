from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count
from dogs.models import Owner
from dogs.serializers import OwnerSerializer, OwnerSerializerDetails

class MyPagination(PageNumberPagination):
    #page_size = 10
    page_size_query_param = 'page_size'
    #max_page_size = 10
    page_query_param = 'p'

class OwnersList(APIView):
    @extend_schema(request=None,responses=OwnerSerializer)
    def get(self,request):
        owners = Owner.objects.annotate(nr_of_dogs=Count('dogs')).order_by('id')
        paginator = MyPagination()
        paginated_owners = paginator.paginate_queryset(owners, request)
        serializer = OwnerSerializer(paginated_owners, many=True)
        return paginator.get_paginated_response(serializer.data)

    @extend_schema(request=None,responses=OwnerSerializer)
    def post(self,request):
        serializer = OwnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OwnersDetails(APIView):
    def get_object(self, id):
        try:
            return  Owner.objects.get(pk=id)
        except Owner.DoesNotExist:
            raise Http404

    @extend_schema(request=None,responses=OwnerSerializerDetails)
    def get(self,request,id):
        owner=self.get_object(id)
        serializer = OwnerSerializerDetails(owner)
        return Response(serializer.data)

    @extend_schema(request=None,responses=OwnerSerializerDetails)
    def put(self,request,id):
        owner = self.get_object(id)
        serializer = OwnerSerializer(owner, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None,responses=OwnerSerializerDetails)
    def delete(self, request, id):
        owner = self.get_object(id)
        owner.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OwnersViewAutocmomplete(APIView):
    serializer_class=OwnerSerializer

    def get(self,request,*args,**kwargs):

        query=request.GET.get('query')
        dogs=Owner.objects.filter(first_name__icontains=query).order_by('first_name')[:20]
        serializer=OwnerSerializer(dogs,many=True)
        return Response(serializer.data)

