# Generated by Django 5.0.7 on 2024-09-03 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0015_product_discount_product_original_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='last_name_updated_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
