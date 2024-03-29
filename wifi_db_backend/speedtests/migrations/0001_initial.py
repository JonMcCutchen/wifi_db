# Generated by Django 5.0.3 on 2024-03-05 16:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('locations', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Speedtest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('download_speed', models.FloatField()),
                ('upload_speed', models.FloatField()),
                ('ping', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='speed_tests', to='locations.location')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='speed_tests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
