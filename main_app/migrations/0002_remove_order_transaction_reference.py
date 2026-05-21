from django.db import migrations, connection

def column_exists(table_name, column_name):
    with connection.cursor() as cursor:
        cursor.execute(f"PRAGMA table_info({table_name})")
        return column_name in [row[1] for row in cursor.fetchall()]

def drop_transaction_reference(apps, schema_editor):
    if not column_exists("main_app_order", "transaction_reference"):
        return
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE main_app_order DROP COLUMN transaction_reference;")

def add_transaction_reference(apps, schema_editor):
    if column_exists("main_app_order", "transaction_reference"):
        return
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE main_app_order ADD COLUMN transaction_reference VARCHAR(255) NULL;")

class Migration(migrations.Migration):
    dependencies = [
        ('main_app', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(drop_transaction_reference, add_transaction_reference),
    ]