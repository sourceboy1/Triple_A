# Generated by Django 5.0.7 on 2024-08-24 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0003_alter_category_options_alter_category_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='productimage',
            name='secondary_image',
            field=models.ImageField(blank=True, null=True, upload_to='products/additional/'),
        ),
    ]
