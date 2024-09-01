# Generated by Django 5.0.7 on 2024-08-30 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0011_alter_product_image_url_alter_productimage_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='image_url',
        ),
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='products/additional/'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='quaternary_image',
            field=models.ImageField(blank=True, null=True, upload_to='products/additional/'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='secondary_image',
            field=models.ImageField(blank=True, null=True, upload_to='products/additional/'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='tertiary_image',
            field=models.ImageField(blank=True, null=True, upload_to='products/additional/'),
        ),
    ]