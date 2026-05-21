from django.db import migrations, connection

def column_exists(table_name, column_name):
    with connection.cursor() as cursor:
        cursor.execute(f"PRAGMA table_info({table_name})")
        return column_name in [row[1] for row in cursor.fetchall()]

def drop_payment_confirmed(apps, schema_editor):
    if not column_exists("main_app_order", "payment_confirmed"):
        return
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE main_app_order DROP COLUMN payment_confirmed;")

def add_payment_confirmed(apps, schema_editor):
    if column_exists("main_app_order", "payment_confirmed"):
        return
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE main_app_order ADD COLUMN payment_confirmed TINYINT(1) DEFAULT 0;")

class Migration(migrations.Migration):
    dependencies = [
        ('main_app', '0003_order_transaction_reference'),
    ]
    operations = [
        migrations.RunPython(drop_payment_confirmed, add_payment_confirmed),
    ]