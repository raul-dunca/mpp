from django.core.paginator import Paginator
from django.db.models import Avg, Count
from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from dogs.models import Dog
from dogs.serializers import DogsSerializer, DogsSerializerDetails, DogOwnerSerializer



class MyPagination(PageNumberPagination):
    #page_size = 10
    page_size_query_param = 'page_size'
    #max_page_size = 10
    page_query_param = 'p'

class DogsList(APIView):
    pagination_class = MyPagination
    @extend_schema(request=None,responses=DogsSerializer)
    def get(self,request):
        dogs = Dog.objects.annotate(nr_of_owners=Count('owners')).order_by('id')
        paginator=MyPagination()
        paginated_dogs = paginator.paginate_queryset(dogs, request)
        serializer = DogsSerializer(paginated_dogs, many=True)
        return paginator.get_paginated_response(serializer.data)

    @extend_schema(request=None,responses=DogsSerializer)
    def post(self,request):
        serializer = DogsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DogsDetails(APIView):
    def get_object(self,id):
        try:
         return Dog.objects.get(pk=id)
        except Dog.DoesNotExist:
            raise Http404

    @extend_schema(request=None,responses=DogsSerializerDetails)
    def get(self,request,id):
        dog=self.get_object(id)

        #toys=Toy.objects.filter(dogs=dog)
        serializer = DogsSerializerDetails(dog)

        return Response(serializer.data)


    @extend_schema(request=None,responses=DogsSerializer)
    def put(self,request,id):
        dog = self.get_object(id)
        serializer = DogsSerializer(dog, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None,responses=DogsSerializer)
    def delete(self,request,id):
        dog = self.get_object(id)
        dog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DogsOrderedByToyPrice(APIView):

    @extend_schema(request=None,responses=DogsSerializer)
    def get(self,request):
        dogs = Dog.objects.annotate(avg_price=Avg('toys__price')).order_by('avg_price')
        paginator = MyPagination()
        paginated_dogs = paginator.paginate_queryset(dogs, request)
        serializer = DogsSerializer(paginated_dogs, many=True)

        return paginator.get_paginated_response(serializer.data)

class DogsOrderedByToysPossessed(APIView):

    @extend_schema(request=None,responses=DogsSerializer)
    def get(self,request):
       #owners=Owner.objects.annotate(cnt=Count('dogs')-1)
        dogs=Dog.objects.annotate(nr_of_owners=Count('owners')).order_by('nr_of_owners')
        paginator = MyPagination()
        paginated_dogs = paginator.paginate_queryset(dogs, request)
        serializer = DogsSerializer(paginated_dogs, many=True)

        return paginator.get_paginated_response(serializer.data)

class BulkAddOwnerstoDog(APIView):

    @extend_schema(request=None,responses=DogOwnerSerializer)
    def post(self, request, dog_id):
        # Retrieve the author with the specified ID
        dog = Dog.objects.get(id=dog_id)

        # Deserialize the data in the request body into a list of new books
        serializer = DogOwnerSerializer(data=request.data, many=True)
        #print(request.data)
        for i in request.data:
            i['dog']=dog_id
        #print(request.data)
        serializer.is_valid(raise_exception=True)


        new_owners = serializer.save()

        dog.owners.add(*new_owners)
        return Response(serializer.data)


class DogsViewAutocmomplete(APIView):
    serializer_class=DogsSerializer

    @extend_schema(request=None, responses=DogsSerializer)
    def get(self,request):

        query=request.query_params.get('query',None)
        if query:
            dogs=Dog.objects.filter(name__icontains=query).order_by('name')[:20]
        else:
            dogs=Dog.objects.all()[:20]
        serializer=DogsSerializer(dogs,many=True)
        return Response(serializer.data)