from django.db import migrations, connection


def column_exists(table_name, column_name):
    if table_name not in connection.introspection.table_names():
        return False
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
        return column_name in [desc[0] for desc in cursor.description] # type: ignore


def drop_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"
    if not column_exists(table_name, 'transaction_reference'):
        return
    with connection.cursor() as cursor:
        cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN transaction_reference;")


def add_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"
    if column_exists(table_name, 'transaction_reference'):
        return
    with connection.cursor() as cursor:
        cursor.execute(
            f"ALTER TABLE {table_name} ADD COLUMN transaction_reference VARCHAR(255) NULL;"
        )


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(drop_transaction_reference, add_transaction_reference),
    ]