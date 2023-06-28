from rest_framework.test import APITestCase
from dogs.models import Dog, Owner, DogOwner
from dogs.serializers import DogsSerializer


class Stats2Test(APITestCase):

    @classmethod
    def setUpTestData(self):

        self.expected_data=[]

        dog1=Dog.objects.create(name='Rex',breed='Pug',colour='Brown',is_healthy='True',date_of_birth='2020-07-15')
        dog2 = Dog.objects.create(name='Max', breed='Beagle', colour='Black', is_healthy='True',date_of_birth='2021-02-15')
        dog3 = Dog.objects.create(name='Spike', breed='Corgi', colour='Orange', is_healthy='True',date_of_birth='2022-02-22')

        owner1 = Owner.objects.create(first_name='Raul', last_name='L', email='a@gmail.com', city='Cluj',date_of_birth='2000-07-15')
        owner2 = Owner.objects.create(first_name='Mark', last_name='Oly', email='mp@gmail.com', city='Cluj',date_of_birth='2000-07-15')
        owner3 = Owner.objects.create(first_name='Lory', last_name='Yagamy', email='ly@gmail.com', city='Cluj',date_of_birth='2000-07-15')

        DogOwner.objects.create(dog=dog1,owner=owner2,adoption_date='2021-07-15',adoption_fee=100)
        DogOwner.objects.create(dog=dog1, owner=owner3, adoption_date='2021-05-15', adoption_fee=500)
        DogOwner.objects.create(dog=dog2, owner=owner1, adoption_date='2021-12-15', adoption_fee=120)

        self.expected_data.append({'id': dog3.id, 'name': dog3.name, 'breed': dog3.breed, 'colour': dog3.colour,
                                   'is_healthy': dog3.is_healthy, 'date_of_birth': dog3.date_of_birth,
                                   'nr_of_owners': 0})

        self.expected_data.append({'id': dog2.id, 'name': dog2.name, 'breed': dog2.breed, 'colour': dog2.colour,
                                   'is_healthy': dog2.is_healthy, 'date_of_birth': dog2.date_of_birth, 'nr_of_owners': 1})
        self.expected_data.append({'id': dog1.id, 'name': dog1.name, 'breed': dog1.breed, 'colour': dog1.colour,
                                   'is_healthy': dog1.is_healthy, 'date_of_birth': dog1.date_of_birth,
                                   'nr_of_owners': 2})

    def test_count_correctly_returned(self):
        response = self.client.get("/dogs/nr-of-owners")
        expected_data_json = DogsSerializer(self.expected_data, many=True).data
        self.assertEqual(len(response.data),len(expected_data_json))
        self.assertEqual(response.data, expected_data_json)
