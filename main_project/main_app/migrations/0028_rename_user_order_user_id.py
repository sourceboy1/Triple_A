# Generated by Django 5.0.7 on 2024-09-12 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0027_remove_order_payment_method_id_remove_order_user_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='user',
            new_name='user_id',
        ),
    ]