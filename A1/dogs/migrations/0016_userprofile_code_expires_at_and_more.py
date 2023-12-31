# Generated by Django 4.1.7 on 2023-04-29 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dogs', '0015_alter_userprofile_birthday'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='code_expires_at',
            field=models.DateTimeField(default=None),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='confirmation_code',
            field=models.CharField(default=None, max_length=200),
        ),
    ]
