# Generated by Django 5.0.7 on 2024-09-12 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0024_remove_order_user_order_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='email',
            field=models.EmailField(default='noemail@example.com', max_length=254),
        ),
    ]
