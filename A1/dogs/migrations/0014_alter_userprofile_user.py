# Generated by Django 4.1.7 on 2023-04-29 13:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dogs', '0013_userprofile_user_alter_userprofile_birthday'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='user',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
