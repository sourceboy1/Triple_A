# Generated by Django 5.0.7 on 2024-08-30 16:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0013_rename_image_product_image_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='image_url',
            new_name='image',
        ),
    ]