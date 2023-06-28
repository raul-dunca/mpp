from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count
from dogs.models import Owner, UserProfile, Dog, Toy, DogOwner
from dogs.serializers import UserRegistationSerializer, UserProfileSerializer, CheckUserSerializer


class RegistrationView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request=None,responses=UserRegistationSerializer)
    def post(self,request):
        serializer = UserRegistationSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()

            return Response({"Message": "User created successfully",
                "User": serializer.data,
                "Confirmation Code": user.confirmation_code}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetails(APIView):
    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except UserProfile.DoesNotExist:
            raise Http404
    @extend_schema(request=None, responses=UserProfileSerializer)
    def get(self, request,id):
        user = self.get_object(id)
        user_profile=UserProfile.objects.get(user_id=user.id)
        dogs_count = Dog.objects.filter(users_id=id).count()
        owners_count = Owner.objects.filter(users_id=id).count()
        toys_count=Toy.objects.filter(users_id=id).count()
        dogowners_count=DogOwner.objects.filter(users_id=id).count()
        user_profile.nr_of_dogs=dogs_count
        user_profile.nr_of_owners = owners_count
        user_profile.nr_of_toys = toys_count
        user_profile.nr_of_dogowners = dogowners_count
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data )

    # @extend_schema(request=None, responses=UserProfileSerializer)
    # def put(self, request, id):
    #     user = self.get_object(id)
    #     serializer = UserProfileSerializer(user, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmRegistrationView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(request=None,responses=UserRegistationSerializer)
    def get(self,request,confirmation_code):
        try:
            print(confirmation_code)
            user_profile = UserProfile.objects.get(confirmation_code=confirmation_code)
            if user_profile.is_confirmation_code_valid():
                raise ValueError('Confirmation code has expired')
            user=User.objects.get(id=user_profile.user_id)
            # Activate user account
            user.is_active = True

            # Delete confirmation code so it can't be reused
            user.confirmation_code = None
            user.code_expires_at = None
            user.save()
        except User.DoesNotExist:
            print('Confirmation code not found')
        except ValueError as e:
            print(e)

        return Response({"Message": "Account activated !"}, status=status.HTTP_200_OK)


class CheckUniqueView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the username already exists
        username = serializer.validated_data['username']
        if User.objects.filter(username=username).exists():
            return Response({"message": "Username already exists"})

        # If the username is unique, return success response
        return Response({"message": "Username is unique"})



