# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-14 03:13
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ColouringLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ColourPicture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(blank=True, max_length=80)),
                ('description', models.TextField(blank=True)),
                ('public_visibility', models.CharField(choices=[('public', 'public'), ('followers', 'followers'), ('private', 'private')], max_length=100)),
                ('image', models.ImageField(upload_to='colourings')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to=settings.AUTH_USER_MODEL)),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OutlineLike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='OutlinePicture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(blank=True, max_length=80)),
                ('description', models.TextField(blank=True)),
                ('public_visibility', models.CharField(choices=[('public', 'public'), ('followers', 'followers'), ('private', 'private')], max_length=100)),
                ('image', models.ImageField(upload_to='outlines')),
                ('resolution', models.CharField(choices=[(300, 'mobile'), (640, 'tablet'), (1000, 'desktop'), (1400, 'large_desktop')], max_length=100)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='colouring.OutlinePicture')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True)),
                ('avatar', models.ImageField(null=True, upload_to='avatars')),
                ('website', models.URLField(blank=True, max_length=1000, null=True)),
                ('location', models.CharField(max_length=100)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('category', models.CharField(blank=True, max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='outlinepicture',
            name='tags',
            field=models.ManyToManyField(blank=True, to='colouring.Tag'),
        ),
        migrations.AddField(
            model_name='outlinelike',
            name='picture',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='colouring.OutlinePicture'),
        ),
        migrations.AddField(
            model_name='outlinelike',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='colourpicture',
            name='outline',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='colouring.OutlinePicture'),
        ),
        migrations.AddField(
            model_name='colourpicture',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='colourpicture',
            name='tags',
            field=models.ManyToManyField(blank=True, to='colouring.Tag'),
        ),
        migrations.AddField(
            model_name='colouringlike',
            name='picture',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='colouring.ColourPicture'),
        ),
        migrations.AddField(
            model_name='colouringlike',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]