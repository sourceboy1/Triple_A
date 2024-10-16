# Generated by Django 5.0.7 on 2024-09-20 14:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0033_remove_order_user_order_user_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='shippingaddress',
            options={'verbose_name': 'Shipping Address', 'verbose_name_plural': 'Shipping Addresses'},
        ),
        migrations.RemoveField(
            model_name='order',
            name='address',
        ),
        migrations.RemoveField(
            model_name='order',
            name='city',
        ),
        migrations.RemoveField(
            model_name='order',
            name='country',
        ),
        migrations.RemoveField(
            model_name='order',
            name='postal_code',
        ),
        migrations.RemoveField(
            model_name='order',
            name='state',
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main_app.shippingaddress'),
        ),
    ]
