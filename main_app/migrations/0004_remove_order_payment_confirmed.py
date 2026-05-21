from django.db import migrations, connection


def column_exists(table_name, column_name):
    if table_name not in connection.introspection.table_names():
        return False
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
        return column_name in [desc[0] for desc in cursor.description] # type: ignore


def drop_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"
    if not column_exists(table_name, 'payment_confirmed'):
        return
    with connection.cursor() as cursor:
        cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN payment_confirmed;")


def add_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"
    if column_exists(table_name, 'payment_confirmed'):
        return
    with connection.cursor() as cursor:
        cursor.execute(
            f"ALTER TABLE {table_name} ADD COLUMN payment_confirmed TINYINT(1) DEFAULT 0;"
        )


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0003_order_transaction_reference'),
    ]

    operations = [
        migrations.RunPython(drop_payment_confirmed, add_payment_confirmed),
    ]