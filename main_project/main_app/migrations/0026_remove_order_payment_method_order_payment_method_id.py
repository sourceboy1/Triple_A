# Generated by Django 5.0.7 on 2024-09-12 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0025_order_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='payment_method',
        ),
        migrations.AddField(
            model_name='order',
            name='payment_method_id',
            field=models.IntegerField(default=1),
        ),
    ]
