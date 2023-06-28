from rest_framework.test import APITestCase
from dogs.models import Dog, Toy
from dogs.serializers import DogsSerializer


class StatsTest(APITestCase):

    @classmethod
    def setUpTestData(self):
        dog1=Dog.objects.create(name='Rex',breed='Pug',colour='Brown',is_healthy='True',date_of_birth='2020-07-15')
        dog2 = Dog.objects.create(name='Max', breed='Beagle', colour='Black', is_healthy='True',date_of_birth='2021-02-15')
        dog3 = Dog.objects.create(name='Spike', breed='Corgi', colour='Orange', is_healthy='True',date_of_birth='2022-02-22')

        self.expected_data =[]

        Toy.objects.create(name="Ball_2", material='Rubber', colour='Red', dog=dog2, price=10)

        Toy.objects.create(name="Ball_1",material='Rubber',colour='Red',dog=dog1,price=10)

        Toy.objects.create(name="Ball_2", material='Rubber', colour='Red', dog=dog1,price=20)

        Toy.objects.create(name="Ball_3", material='Rubber', colour='Red', dog=dog3,price=30)

        self.expected_data.append({'id': dog2.id, 'name': dog2.name, 'breed': dog2.breed,'colour':dog2.colour,'is_healthy':dog2.is_healthy,'date_of_birth':dog2.date_of_birth,'avg_price':10})
        self.expected_data.append({'id': dog1.id, 'name': dog1.name, 'breed': dog1.breed,'colour':dog1.colour,'is_healthy':dog1.is_healthy,'date_of_birth':dog1.date_of_birth,'avg_price':15.0})
        self.expected_data.append({'id': dog3.id, 'name': dog3.name, 'breed': dog3.breed,'colour':dog3.colour,'is_healthy':dog3.is_healthy,'date_of_birth':dog3.date_of_birth,'avg_price':30.0})

    def test_count_correctly_returned(self):
        response = self.client.get("/dogs/avg-by-toy-price")
        expected_data_json = DogsSerializer(self.expected_data, many=True).data
        self.assertEqual(len(response.data),len(expected_data_json))
        self.assertEqual(response.data, expected_data_json)
