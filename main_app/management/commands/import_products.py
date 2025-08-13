import csv
import os
from django.core.files import File
from django.core.management.base import BaseCommand
from main_app.models import Product, ProductImage, Category

class Command(BaseCommand):
    help = 'Import products and additional images from CSV file'

    def handle(self, *args, **kwargs):
        csv_path = os.path.join('data', 'products.csv')
        media_path = os.path.join('media')  # Root media folder

        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                name = (row.get('name') or '').strip()
                description = (row.get('description') or '').strip()

                # Handle numeric fields: if blank, set to None
                price = (row.get('price') or '').strip() or None
                original_price = (row.get('original_price') or '').strip() or None
                discount = (row.get('discount') or '').strip() or None
                stock = (row.get('stock') or '').strip() or None
                category_id = (row.get('category_id') or '').strip() or None

                # Main product image
                main_image = (row.get('main_image') or '').strip() or None

                # Four extra images
                additional_image = (row.get('additional_image') or '').strip() or None
                secondary_image = (row.get('secondary_image') or '').strip() or None
                tertiary_image = (row.get('tertiary_image') or '').strip() or None
                quaternary_image = (row.get('quaternary_image') or '').strip() or None

                # Create Product
                product = Product(
                    name=name,
                    description=description,
                    price=price,
                    original_price=original_price,
                    discount=discount,
                    stock=stock,
                    category_id=category_id
                )

                # Attach main image if exists
                if main_image:
                    full_image_path = os.path.join(media_path, main_image)
                    if os.path.exists(full_image_path):
                        with open(full_image_path, 'rb') as img_file:
                            product.image.save(os.path.basename(main_image), File(img_file), save=False)
                product.save()

                # Add additional images
                if any([additional_image, secondary_image, tertiary_image, quaternary_image]):
                    additional = ProductImage(product=product)

                    def attach_image(field_name, path):
                        if path:
                            full_path = os.path.join(media_path, path)
                            if os.path.exists(full_path):
                                with open(full_path, 'rb') as img_file:
                                    getattr(additional, field_name).save(os.path.basename(path), File(img_file), save=False)

                    attach_image('image', additional_image)
                    attach_image('secondary_image', secondary_image)
                    attach_image('tertiary_image', tertiary_image)
                    attach_image('quaternary_image', quaternary_image)
                    additional.save()

                self.stdout.write(self.style.SUCCESS(f"Imported: {name}"))
