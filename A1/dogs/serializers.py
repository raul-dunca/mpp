import datetime
import re
import uuid
from datetime import date

import pycountry as pycountry
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Dog, Owner, DogOwner, UserProfile
from .models import Toy
from django.contrib.auth.models import User

#python -> json

class DogsSerializer(serializers.ModelSerializer):
    avg_price = serializers.FloatField(read_only=True)
    nr_of_owners = serializers.IntegerField(read_only=True)
    class Meta:
        model=Dog
        fields=['id','name','breed','colour','is_healthy','date_of_birth','avg_price','nr_of_owners','users']

    def validate_date_of_birth(self, value):
        min_date = date(2010, 1, 1)
        if value < min_date:
            raise serializers.ValidationError(f"The date_of_birth must be higher than {min_date}!")
        return value

    def validate_name(self, value):

        if len(value)<=2:
            raise serializers.ValidationError(f"The name must have at least 3 characters!")
        return value

class ToySerializer(serializers.ModelSerializer):
    nr_of_toys = serializers.IntegerField(read_only=True)
    class Meta:
        model=Toy
        fields=['id','name','dog','material','colour','price','descriptions','nr_of_toys','users']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

class OwnerSerializer(serializers.ModelSerializer):
    nr_of_dogs = serializers.IntegerField(read_only=True)
    class Meta:
        model=Owner
        fields=['id','first_name','last_name','email','city','date_of_birth','nr_of_dogs','users']

    def validate_date_of_birth(self, value):
        max_date = date(2016, 1, 1)
        if value > max_date:
            raise serializers.ValidationError(f"The date_of_birth must be lower than {max_date}.")
        return value

    def validate_email(self, value):
        # Define the regular expression pattern
        pattern = r"^.+@.+\..+$"


        # Use the re module to check if the string matches the pattern
        if not re.match(pattern, value):
            raise serializers.ValidationError(f"The email must be a valid one!")
        return value

class DogOwnerSerializer(serializers.ModelSerializer):
    dog = serializers.PrimaryKeyRelatedField(queryset=Dog.objects.all())
    owner = serializers.PrimaryKeyRelatedField(queryset=Owner.objects.all())
    class Meta:
        model = DogOwner
        fields = ['dog', 'owner','adoption_date','adoption_fee','users']
        #depth=1



class DogOwnerSerializerForDogs(serializers.ModelSerializer):
    owner=OwnerSerializer(read_only=True)
    #dog=DogsSerializer(read_only=True)
    class Meta:
        model = DogOwner
        fields = [ 'owner','adoption_date','adoption_fee']
        #depth=1

class DogOwnerSerializerForOwners(serializers.ModelSerializer):
    #owner=OwnerSerializer(read_only=True)
    dog=DogsSerializer(read_only=True)
    class Meta:
        model = DogOwner
        fields = [ 'dog','adoption_date','adoption_fee']
        #depth=1

class DogsSerializerDetails(serializers.ModelSerializer):
    toys=ToySerializer(many=True)
    owners=DogOwnerSerializerForDogs(many=True)
    class Meta:
        model=Dog
        fields=['id','name','breed','colour','is_healthy','date_of_birth','toys','owners','users']

    def validate_date_of_birth(self, value):
        min_date = date(2010, 1, 1)
        if value < min_date:
            raise serializers.ValidationError(f"The date_of_birth must be higher than {min_date}.")
        return value

    def validate_name(self, value):

        if len(value)<=2:
            raise serializers.ValidationError(f"The name must have at least 3 characters!")
        return value

class ToySerializerDetails(serializers.ModelSerializer):
    class Meta:
        model=Toy
        fields=['id','name','dog','material','colour','price','descriptions','users']
        depth=1

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value



class OwnerSerializerDetails(serializers.ModelSerializer):
    dogs=DogOwnerSerializerForOwners(many=True)
    class Meta:
        model = Owner
        fields=['id','first_name','last_name','email','city','date_of_birth','dogs','users']

    def validate_date_of_birth(self, value):
        max_date = date(2016, 1, 1)
        if value > max_date:
            raise serializers.ValidationError(f"The date_of_birth must be lower than {max_date}.")
        return value

    def validate_email(self, value):
        # Define the regular expression pattern
        pattern = r"^.+@.+\..+$"

        # Use the re module to check if the string matches the pattern
        if not re.match(pattern, value):
            raise serializers.ValidationError(f"The email must be a valid one!")
        return value

class DogOwnersSerializerDetails(serializers.ModelSerializer):
    dog=DogsSerializer()
    owner=OwnerSerializer()
    class Meta:
        model = DogOwner
        fields = ['dog', 'owner', 'adoption_date', 'adoption_fee','users']


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if username and password:
            user = authenticate(username=username, password=password)

            if not user:
                raise AuthenticationFailed("Invalid credentials")

            if not user.is_active:
                raise AuthenticationFailed("User is inactive")

            refresh = RefreshToken.for_user(user)
            return {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }
        else:
            raise AuthenticationFailed("Must include username and password")


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    nr_of_dogs=serializers.IntegerField(read_only=True)
    nr_of_toys=serializers.IntegerField(read_only=True)
    nr_of_owners=serializers.IntegerField(read_only=True)
    nr_of_dogowners=serializers.IntegerField(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['bio','email','birthday','country','gender','username','nr_of_dogs','nr_of_toys','nr_of_owners','nr_of_dogowners']

    def validate_bio(self, value):
        if len(value)>160:
            raise serializers.ValidationError(f"The bio must have at most 160 characters!")
        return value

    def validate_email(self, value):
        # Define the regular expression pattern
        pattern = r"^.+@.+\..+$"

        # Use the re module to check if the string matches the pattern
        if not re.match(pattern, value):
            raise serializers.ValidationError(f"The email must be a valid one!")
        return value

    def validate_birthday(self, value):
        max_date = date(2016, 1, 1)
        if value > max_date:
            raise serializers.ValidationError(f"The date_of_birth must be lower than {max_date}.")
        return value

    def get_username(self, obj):
        return obj.user.username


class UserRegistationSerializer(serializers.ModelSerializer):
    username=serializers.CharField(max_length=50,min_length=4)
    password = serializers.CharField(write_only=True, required=True)
    bio = serializers.CharField(max_length=10000,write_only=True)
    birthday = serializers.DateField(write_only=True)
    email = serializers.CharField(max_length=150,write_only=True)
    country = serializers.CharField(max_length=250,write_only=True)
    gender = serializers.CharField(max_length=150,write_only=True)
    class Meta:
        model = User
        fields = ['username','password','email','bio','birthday','country','gender']

    def validate(self,args):
        username=args.get('username',None)
        password = args.get('password', None)
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError('Username already exists!')
        if len(password) < 8:
            raise serializers.ValidationError("The password must be at least 8 characters long.")
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError("The password must contain at least one uppercase letter.")
        if not any(char.islower() for char in password):
            raise serializers.ValidationError("The password must contain at least one lowercase letter.")
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError("The password must contain at least one digit.")
        if not any(
                char in ['!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=' '?', '/'] for char in password):
            raise serializers.ValidationError("The password must contain at least one special character.")
        return super().validate(args)

    def validate_bio(self, value):
        if len(value)>160:
            raise serializers.ValidationError(f"The bio must have at most 160 characters!")
        return value

    def validate_email(self, value):
        # Define the regular expression pattern
        pattern = r"^.+@.+\..+$"

        # Use the re module to check if the string matches the pattern
        if not re.match(pattern, value):
            raise serializers.ValidationError(f"The email must be a valid one!")
        return value

    def validate_birthday(self, value):
        max_date = date(2016, 1, 1)
        if value > max_date:
            raise serializers.ValidationError(f"The date_of_birth must be lower than {max_date}.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            is_active=False
        )

        # Create and store confirmation code for email verification
        user.confirmation_code = str(uuid.uuid4())
        user.code_expires_at = datetime.datetime.now() + datetime.timedelta(minutes=10)
        user.save()


        UserProfile.objects.create(user_id=user.id, confirmation_code=user.confirmation_code,
                                   code_expires_at=user.code_expires_at,bio=validated_data["bio"],birthday=validated_data["birthday"],email=validated_data["email"],country=validated_data["country"],gender=validated_data["gender"])
        return user



class CheckUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)


