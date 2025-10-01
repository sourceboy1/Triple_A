from django.db import migrations, connection

def drop_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"  # adjust if your table is named differently

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = %s
              AND COLUMN_NAME = 'transaction_reference';
        """, [table_name])
        (exists,) = cursor.fetchone() # type: ignore

        if exists:
            cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN transaction_reference;")

def add_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"  # adjust if needed

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = %s
              AND COLUMN_NAME = 'transaction_reference';
        """, [table_name])
        (exists,) = cursor.fetchone() # type: ignore

        if not exists:
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
