# main_app/management/commands/fix_category_slugs.py
from django.core.management.base import BaseCommand
from django.utils.text import slugify
import re

from main_app.models import Category

def normalize_for_slug(name: str) -> str:
    # Normalize unicode separators into spaces/hyphens, replace ampersand with 'and'
    # and remove weird characters, then slugify.
    if not name:
        return ''
    s = name.strip()
    # Replace common problematic tokens with spaces so slugify adds hyphens:
    s = s.replace('&', ' and ')
    # Replace visual separators like › ›› / \ | etc with spaces
    s = re.sub(r'[›››/\\|»«–—,;:]+', ' ', s)
    # Replace multiple non-alphanumeric (except space) characters with a space
    s = re.sub(r'[^0-9a-zA-Z\s-]', ' ', s)
    # Collapse multiple spaces/hyphens to single space
    s = re.sub(r'[\s\-]+', ' ', s).strip()
    return slugify(s)

class Command(BaseCommand):
    help = "Normalize category slugs: replaces & with 'and', separators with hyphens and slugifies."

    def handle(self, *args, **options):
        categories = Category.objects.all()
        self.stdout.write(f"Found {categories.count()} categories.")
        for c in categories:
            old = c.slug or '<none>'
            new = normalize_for_slug(c.name)
            # ensure uniqueness: append -1, -2... if needed
            base = new
            i = 1
            while Category.objects.filter(slug=new).exclude(pk=c.pk).exists():
                new = f"{base}-{i}"
                i += 1
            if old != new:
                c.slug = new
                c.save(update_fields=['slug'])
                self.stdout.write(self.style.SUCCESS(f"Updated {c.pk}: '{c.name}' -> {old}  => {new}"))
            else:
                self.stdout.write(f"Unchanged {c.pk}: '{c.name}' -> {old}")
        self.stdout.write(self.style.NOTICE("Done."))
