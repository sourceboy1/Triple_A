from django.core.management.base import BaseCommand
from main_app.models import SecretProduct

class Command(BaseCommand):
    help = "Remove whitespace from imei_or_serial for all SecretProduct records"

    def handle(self, *args, **options):
        qs = SecretProduct.objects.all()
        total = qs.count()
        updated = 0
        for p in qs:
            orig = p.imei_or_serial or ""
            cleaned = "".join(str(orig).split())
            if cleaned != orig:
                p.imei_or_serial = cleaned
                p.save(update_fields=['imei_or_serial'])
                updated += 1
                self.stdout.write(self.style.SUCCESS(f"Updated id={p.id}: '{orig}' -> '{cleaned}'")) # type: ignore
        self.stdout.write(self.style.SUCCESS(f"Done. Processed {total} records, updated {updated}"))
