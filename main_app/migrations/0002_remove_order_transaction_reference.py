from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('main_app', '0001_initial'),
    ]

    operations = [
        # other operations...
        migrations.RunSQL(
            sql="ALTER TABLE `orders` DROP COLUMN IF EXISTS `transaction_reference`;",
            reverse_sql="ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `transaction_reference` VARCHAR(255) NULL;"
        ),
        # other operations...
    ]
