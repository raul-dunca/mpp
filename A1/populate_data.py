import datetime
import os
import random
from datetime import date, timedelta

import django
import export as export
import pytz

#os.environ.setdefault('DEFAULT_SETTINGS_MODULE','dogs.settings')

#django.setup()
import dogs

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dogs.settings')

import django
django.setup()


#from dogs.models import Dog
from django.contrib.auth.hashers import make_password

from faker.providers import date_time
from psycopg2._psycopg import cursor
from psycopg2.extras import execute_values

if __name__=='__main__':
    from faker import Faker

    fake = Faker()
    fake.add_provider(date_time)
    dog_breeds = ['Labrador', 'Corgi', 'Golden Retriever', 'French Bulldog', 'Bulldog', 'Poodle',
                  'Beagle', 'Rottweiler', 'Pug', 'Boxer','Shiba Inu','Husky','Chihuahua','Dalmatian']

    toy_names = ['Ball', 'Disc', 'Rope', 'Bone', 'Chicken', 'Teddy bear']
    toy_materials = ['Plastic', 'Wood', 'Metal', 'Fabric', 'Leather', 'Fur','Rubber']

    batch_size = 1000
    with open('dogs.sql', 'w') as file:

        sql = "TRUNCATE TABLE auth_user RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")


        admin_pass=make_password("admin")

        sql = f"INSERT INTO auth_user (password, is_superuser, username, is_staff, is_active, date_joined, first_name, last_name, email) VALUES ('{admin_pass}', True, 'admin', True, True, NOW(), 'Admin', 'User', 'admin@example.com');"
        file.write(sql + "\n")

        sql = f"INSERT INTO dogs_userprofile (bio, birthday, email, country, user_id, gender) VALUES ('admin', '1900-10-10', 'admin@gmail.com', 'ADMIN', 1, 'Admin');"
        file.write(sql + "\n")



        sql = f"TRUNCATE TABLE dogs_userprofile RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")

        sql = f"TRUNCATE TABLE dogs_dogowner RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")
        sql = f"TRUNCATE TABLE dogs_owner RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")
        sql = f"TRUNCATE TABLE dogs_dog RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")
        sql = f"TRUNCATE TABLE dogs_toy RESTART IDENTITY CASCADE;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner DROP CONSTRAINT dogs_dogowner_dog_id_2fb6aa21_fk_dogs_dog_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner DROP CONSTRAINT dogs_dogowner_owner_id_740a195f_fk_dogs_owner_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_toy DROP CONSTRAINT dogs_toy_dog_id_a028f4a6_fk_dogs_dog_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dog DROP CONSTRAINT dogs_dog_users_id_6c8608c6_fk_auth_user_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_owner DROP CONSTRAINT dogs_owner_users_id_cc22e1b7_fk_auth_user_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_toy DROP CONSTRAINT dogs_toy_users_id_56342dda_fk_auth_user_id;"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner DROP CONSTRAINT dogs_dogowner_users_id_aff09850_fk_auth_user_id;"
        file.write(sql + "\n")

        sql = f"DROP INDEX toy_price_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX toy_dog_id_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX dogowner_dog_id_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX dogowner_owner_id_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX toy_user_idx;"
        file.write(sql + "\n")


        sql = f"DROP INDEX dog_user_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX owner_user_idx;"
        file.write(sql + "\n")

        sql = f"DROP INDEX dogowner_user_idx ;"
        file.write(sql + "\n")

        timezone = pytz.timezone('Europe/Bucharest')
        user_password = make_password("Password1@")

        user_isactive = True
        user_issuper = False
        user_isstaff = False
        id_user=1
        for i in range(0, 10000, 1000):
            data = []
            data2=[]
            for j in range(i, i + 1000):
                id_user+=1
                user_username = f"user{id_user}"
                user_firstname=""
                user_lastname=""
                user_mail=""
                user_datejoinned=datetime.datetime.now(timezone)

                # user_bio = fake.text(max_nb_chars=150)
                # user_birthday = fake.date_of_birth(minimum_age=9)
                # user_email = fake.email()
                # user_country = fake.country().replace("'", " ")
                # user_gender = random.choice(["Male", "Female"])

                user_bio = fake.text(max_nb_chars=160)
                user_birthday = fake.date_of_birth(minimum_age=9)
                user_email = fake.email()
                user_country = fake.country().replace("'", " ")
                user_gender = random.choice(["Male", "Female"])


                data.append(f"('{user_password}', '{user_issuper}', '{user_username}', '{user_isstaff}', '{user_isactive}', '{user_datejoinned}', '{user_firstname}','{user_lastname}','{user_mail}')")
                data2.append(f"('{user_bio}', '{user_birthday}', '{user_email}', '{user_country}', '{user_gender}', '{id_user}')")
            sql = f"INSERT INTO auth_user (password, is_superuser, username,is_staff,is_active,date_joined,first_name,last_name,email) VALUES {','.join(data)};"
            file.write(sql + "\n")
            sql = f"INSERT INTO dogs_userprofile (bio, birthday,email, country,gender,user_id) VALUES {','.join(data2)};"
            file.write(sql + "\n")
        print("Users done")

        for i in range(0, 1000000, 1000):
            data = []
            for j in range(i, i + 1000):
                dog_user=fake.random_int(min=1, max=10000)
                dog_name = fake.first_name()
                dog_breed = random.choice(dog_breeds)
                dog_color = fake.color_name()
                dog_is_healthy=random.choice([True, False])
                dog_date_of_birth = fake.date_between(start_date='-12y', end_date='today')
                data.append(f"('{dog_name}', '{dog_breed}', '{dog_color}', '{dog_is_healthy}', '{dog_date_of_birth}', '{dog_user}')")

            sql = f"INSERT INTO dogs_dog (name, breed, colour,is_healthy,date_of_birth,users_id) VALUES {','.join(data)};"
            file.write(sql + "\n")

        print("Dogs done")

        for i in range(0, 1000000, 1000):
            data = []
            for j in range(i, i + 1000):
                toy_user = fake.random_int(min=1, max=10000)
                toy_name=random.choice(toy_names)
                toy_material=random.choice(toy_materials)
                toy_colour=fake.color_name()
                toy_price=fake.random_int(min=1,max=1000)
                toy_dog=fake.random_int(min=1, max=1000000)
                desciption=fake.words(nb=100)
                toy_description=" ".join(desciption)
                data.append(f"('{toy_name}', '{toy_material}', '{toy_colour}', '{toy_price}', '{toy_description}', '{toy_dog}','{toy_user}')")
            sql = f"INSERT INTO dogs_toy (name, material, colour,price,descriptions,dog_id,users_id) VALUES {','.join(data)};"
            file.write(sql + "\n")

        print("Toys done")
        for i in range(0, 1000000, 1000):
            data=[]

            for j in range(i, i+1000):
                owner_user = fake.random_int(min=1, max=10000)
                owner_first_name=fake.first_name()
                owner_last_name=fake.last_name()
                owner_email=fake.email()
                owner_city=fake.city()
                owner_date_of_birth=fake.date_of_birth(minimum_age =9)
                data.append(f"('{owner_first_name}', '{owner_last_name}', '{owner_email}', '{owner_city}', '{owner_date_of_birth}','{owner_user}')")
            sql = f"INSERT INTO dogs_owner (first_name, last_name, email, city, date_of_birth,users_id) VALUES {','.join(data)};"
            file.write(sql + "\n")

        print("Owners done")

        pairs=set()
        nr=10000000

        for i in range(10000):
            if (i % 1000 == 0):
                print(f'{i * 1000} done')

            dogowner_dog=fake.random_int(min=i * 100 + 1, max=(i + 1) * 100)
            data=[]
            for j in range(1000):
                dogowner_user = fake.random_int(min=1, max=10000)
                dogowner_owner = fake.random_int(min=j * 1000 + 1, max=(j + 1) * 1000)

                dogowner_adoption_date = fake.date_between(start_date=dog_date_of_birth, end_date='today')
                dogowner_adoption_fee = fake.random_int(min=1,max=10000)
                data.append(f"('{dogowner_dog}', '{dogowner_owner}', '{dogowner_adoption_date}', '{dogowner_adoption_fee}','{dogowner_user}')")

            sql = f"INSERT INTO dogs_dogowner (dog_id, owner_id, adoption_date, adoption_fee,users_id) VALUES {','.join(data)};"
            file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_toy ADD CONSTRAINT dogs_toy_dog_id_a028f4a6_fk_dogs_dog_id FOREIGN KEY(dog_id) REFERENCES dogs_dog(id);"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner ADD CONSTRAINT dogs_dogowner_dog_id_2fb6aa21_fk_dogs_dog_id FOREIGN KEY(dog_id) REFERENCES dogs_dog(id);"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner ADD CONSTRAINT dogs_dogowner_owner_id_740a195f_fk_dogs_owner_id FOREIGN KEY(owner_id) REFERENCES dogs_owner(id);"
        file.write(sql + "\n")


        sql = f"ALTER TABLE dogs_dog ADD CONSTRAINT dogs_dog_users_id_6c8608c6_fk_auth_user_id FOREIGN KEY(users_id) REFERENCES auth_user(id);"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_owner ADD CONSTRAINT dogs_owner_users_id_cc22e1b7_fk_auth_user_id FOREIGN KEY(users_id) REFERENCES auth_user(id);"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_toy ADD CONSTRAINT dogs_toy_users_id_56342dda_fk_auth_user_id FOREIGN KEY(users_id) REFERENCES auth_user(id);"
        file.write(sql + "\n")

        sql = f"ALTER TABLE dogs_dogowner ADD CONSTRAINT dogs_dogowner_users_id_aff09850_fk_auth_user_id FOREIGN KEY(users_id) REFERENCES auth_user(id);"
        file.write(sql + "\n")



        sql = f"CREATE INDEX toy_price_idx ON dogs_toy(price);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX toy_dog_id_idx ON dogs_toy(dog_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX dogowner_owner_id_idx ON dogs_dogowner(owner_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX dogowner_dog_id_idx ON dogs_dogowner(dog_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX toy_user_idx ON dogs_toy(users_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX dog_user_idx ON dogs_dog(users_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX owner_user_idx ON dogs_owner(users_id);"
        file.write(sql + "\n")

        sql = f"CREATE INDEX dogowner_user_idx ON dogs_dogowner(users_id);"
        file.write(sql + "\n")




