from django.db import models
from django.contrib import admin
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars', null=True)
    website = models.URLField(blank=True, null=True, max_length=1000)
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


class AbstractPicture(models.Model):
    """
    The picture object that OutlinePicture and ColourPicture inherit from. If 
    the owner is deleted, their pictures will delete (but coloured pictures
    using those outlines will not).
    """
    
    PUBLIC_SETTINGS = (
        ('public', 'public'),
        ('followers', 'followers'),
        ('private', 'private'),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    public_visibility = models.CharField(choices=PUBLIC_SETTINGS, max_length=100, default='public')
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField('Tag', blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return "{} by {}".format(self.name, self.owner.username)


class OutlinePicture(AbstractPicture):
    """
    The outline image to be coloured. For usability, pictures are saved as one of 
    a few pre-set resolutions to cater for different devices and screen sizes. An 
    image can be saved at multiple resolutions and tweaked to optimise lines. The 
    'parent' field allows these images to be grouped together (the original's value 
    is null).
    """

    RESOLUTIONS = (
        (300, 'mobile'),
        (640, 'tablet'),
        (1000, 'desktop'),
        (1400, 'large_desktop')
    )

    image = models.ImageField(upload_to='outlines')
    resolution = models.CharField(choices=RESOLUTIONS, max_length=100)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)


class ColourPicture(AbstractPicture):
    """
    The coloured picture, linked to the original outline. If the outline picture
    is deleted, the colour picture based on it will survive.
    """
    image = models.ImageField(upload_to='colourings')
    outline = models.ForeignKey(OutlinePicture, on_delete=models.SET_NULL, null=True)


class Tag(models.Model):
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class OutlineLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    picture = models.ForeignKey(OutlinePicture)

    def __str__(self):
        return "{} | {}".format(self.user.username, self.picture.name)


class ColouringLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    picture = models.ForeignKey(ColourPicture)

    def __str__(self):
        return "{} | {}".format(self.user.username, self.picture.name)


class Follow(models.Model):
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='follower')
    following = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='following')

    def __str__(self):
        return "{} | {}".format(self.follower.username, self.following.username)


from django.db.models.signals import post_save



admin.site.register(Profile)
admin.site.register(OutlinePicture)
admin.site.register(ColourPicture)
admin.site.register(Tag)
admin.site.register(OutlineLike)
admin.site.register(ColouringLike)
admin.site.register(Follow)

