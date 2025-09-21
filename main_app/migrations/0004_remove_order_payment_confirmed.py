from django.db import migrations, connection

def drop_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"  # adjust if your table is named differently

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = %s
              AND COLUMN_NAME = 'payment_confirmed';
        """, [table_name])
        (exists,) = cursor.fetchone() # type: ignore

        if exists:
            cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN payment_confirmed;")

def add_payment_confirmed(apps, schema_editor):
    table_name = "main_app_order"

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*)
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = %s
              AND COLUMN_NAME = 'payment_confirmed';
        """, [table_name])
        (exists,) = cursor.fetchone() # type: ignore

        if not exists:
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
