from django.db import migrations, connection


def get_column_names(table_name):
    """Returns a list of column names for the given table, works on any DB."""
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 0")
        return [desc[0] for desc in cursor.description] # type: ignore


def drop_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"
    db_vendor  = connection.vendor  # 'sqlite', 'mysql', 'postgresql', etc.

    # Check if the table even exists first
    if table_name not in connection.introspection.table_names():
        return

    columns = get_column_names(table_name)
    if 'transaction_reference' not in columns:
        return  # nothing to drop

    if db_vendor == 'sqlite':
        # SQLite doesn't support DROP COLUMN directly before SQLite 3.35
        # Use Django's safe approach: recreate via schema_editor
        with connection.cursor() as cursor:
            cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN transaction_reference;")
    else:
        # MySQL, PostgreSQL
        with connection.cursor() as cursor:
            cursor.execute(f"ALTER TABLE {table_name} DROP COLUMN transaction_reference;")


def add_transaction_reference(apps, schema_editor):
    table_name = "main_app_order"
    db_vendor  = connection.vendor

    if table_name not in connection.introspection.table_names():
        return

    columns = get_column_names(table_name)
    if 'transaction_reference' in columns:
        return  # already exists, nothing to add

    with connection.cursor() as cursor:
        if db_vendor == 'sqlite':
            cursor.execute(
                f"ALTER TABLE {table_name} ADD COLUMN transaction_reference VARCHAR(255) NULL;"
            )
        else:
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