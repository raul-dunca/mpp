from multiprocessing.dummy import Value

from django.core.paginator import Paginator
from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count, Case, Max
from dogs.models import Toy
from dogs.serializers import ToySerializer, ToySerializerDetails

class MyPagination(PageNumberPagination):
    #page_size = 10
    page_size_query_param = 'page_size'
    #max_page_size = 10
    page_query_param = 'p'

class ToysList(APIView):
    @extend_schema(request=None,responses=ToySerializer)
    def get(self,request):

        #toys = Toy.objects.select_related('dog').prefetch_related('dog__toys').annotate(nr_of_toys=Count('dog__toys')-1).order_by('id')

        toys= Toy.objects.annotate(nr_of_toys=Count('dog_id')).order_by('id')

        #toys = Toy.objects.select_related('dog').prefetch_related('dog__toys').annotate(nr_of_toys=Max(Count('dog__toys')-1, Value(0))).order_by('id')
        #toys=Toy.objects.all()
        paginator = MyPagination()
        price = self.request.query_params.get('price')
        if price is not None:
            toys = toys.filter(price__gt=price)
        paginated_toys = paginator.paginate_queryset(toys, request)
        serializer = ToySerializer(paginated_toys, many=True)

        return paginator.get_paginated_response(serializer.data)



    @extend_schema(request=None,responses=ToySerializer)
    def post(self,request):
        serializer = ToySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ToysDetails(APIView):
    def get_object(self, id):
        try:
            return  Toy.objects.get(pk=id)
        except Toy.DoesNotExist:
            raise Http404

    @extend_schema(request=None,responses=ToySerializerDetails)
    def get(self,request,id):
        toy=self.get_object(id)
        serializer = ToySerializerDetails(toy)
        return Response(serializer.data)

    @extend_schema(request=None,responses=ToySerializerDetails)
    def put(self,request,id):
        toy = self.get_object(id)
        serializer = ToySerializer(toy, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None,responses=ToySerializerDetails)
    def delete(self, request, id):
        toy = self.get_object(id)
        toy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
