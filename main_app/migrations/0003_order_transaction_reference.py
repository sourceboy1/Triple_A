from django.db import migrations, connection

def column_exists(table_name, column_name):
    with connection.cursor() as cursor:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [row[1] for row in cursor.fetchall()]
        return column_name in columns

def add_transaction_reference(apps, schema_editor):
    if column_exists("main_app_order", "transaction_reference"):
        return  # already exists, nothing to do
    with connection.cursor() as cursor:
        cursor.execute(
            "ALTER TABLE main_app_order ADD COLUMN transaction_reference VARCHAR(255) NULL;"
        )

def remove_transaction_reference(apps, schema_editor):
    # SQLite doesn't support DROP COLUMN in older versions — just skip
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('main_app', '0002_remove_order_transaction_reference'),
    ]
    operations = [
        migrations.RunPython(add_transaction_reference, remove_transaction_reference),
    ]