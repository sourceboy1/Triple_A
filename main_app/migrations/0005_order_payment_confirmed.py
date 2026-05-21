from django.db import migrations, connection


def column_exists(table_name, column_name):
    if table_name not in connection.introspection.table_names():
        return False
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
        return column_name in [desc[0] for desc in cursor.description] # type: ignore


def add_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"
    if column_exists(table_name, 'payment_confirmed'):
        return  # already exists, skip
    Order = apps.get_model('main_app', 'Order')
    field = Order._meta.get_field('payment_confirmed')
    schema_editor.add_field(Order, field)


def remove_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"
    if not column_exists(table_name, 'payment_confirmed'):
        return  # already gone, skip
    Order = apps.get_model('main_app', 'Order')
    field = Order._meta.get_field('payment_confirmed')
    schema_editor.remove_field(Order, field)


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0004_remove_order_payment_confirmed'),
    ]

    operations = [
        migrations.RunPython(add_payment_confirmed, remove_payment_confirmed),
    ]