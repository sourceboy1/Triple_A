# main_app/management/commands/verify_paystack_payments.py
import logging
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
import requests
from django.utils import timezone
from datetime import timedelta

from main_app.models import Order

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Verify Paystack payments for orders with a transaction_reference and not confirmed yet."

    def add_arguments(self, parser):
        parser.add_argument(
            '--order', '-o', type=int, help='Verify a single order by order_id'
        )
        parser.add_argument(
            '--since-days', '-s', type=int, default=None,
            help='Only verify orders created within the last N days (default: all unconfirmed orders)'
        )
        parser.add_argument(
            '--dry-run', action='store_true', help='Show what would be done, do not update DB'
        )

    def handle(self, *args, **options):
        order_id = options.get('order')
        since_days = options.get('since_days')
        dry_run = options.get('dry_run')

        paystack_key = getattr(settings, "PAYSTACK_SECRET_KEY", None)
        if not paystack_key:
            raise CommandError("PAYSTACK_SECRET_KEY not set in settings/env. Aborting.")

        if order_id:
            qs = Order.objects.filter(order_id=order_id)
        else:
            qs = Order.objects.filter(payment_confirmed=False).exclude(transaction_reference__isnull=True).exclude(transaction_reference__exact='')

        if since_days:
            cutoff = timezone.now() - timedelta(days=since_days)
            qs = qs.filter(created_at__gte=cutoff)

        total = qs.count()
        if total == 0:
            self.stdout.write(self.style.SUCCESS("No orders found to verify."))
            return

        self.stdout.write(f"Found {total} orders to verify. Dry run: {dry_run}")

        verified_count = 0
        failed_count = 0

        for order in qs.iterator():
            reference = order.transaction_reference
            if not reference:
                self.stdout.write(self.style.WARNING(f"Order {order.order_id} has no transaction_reference, skipping."))
                continue

            self.stdout.write(f"Verifying Order {order.order_id} Reference: {reference} ...")

            verify_url = f"https://api.paystack.co/transaction/verify/{reference}"
            headers = {"Authorization": f"Bearer {paystack_key}", "Accept": "application/json"}

            try:
                resp = requests.get(verify_url, headers=headers, timeout=15)
                resp_json = resp.json()
            except requests.RequestException as e:
                self.stdout.write(self.style.ERROR(f"Network error while verifying {order.order_id}: {e}"))
                logger.exception(f"Paystack verification network error for order {order.order_id}")
                failed_count += 1
                continue

            if resp.status_code != 200 or not resp_json.get("status"):
                self.stdout.write(self.style.ERROR(f"Paystack verification failed for {order.order_id}: {resp_json.get('message', 'No message')}"))
                failed_count += 1
                continue

            data = resp_json.get("data", {})
            status_str = data.get("status")
            amount_kobo = data.get("amount")
            if status_str != "success":
                self.stdout.write(self.style.WARNING(f"Order {order.order_id} not successful on Paystack (status={status_str})."))
                failed_count += 1
                continue

            # Compare amounts (optional strict check)
            try:
                expected_kobo = int(round(float(order.total_amount) * 100))
                if int(amount_kobo) != expected_kobo:
                    self.stdout.write(self.style.ERROR(
                        f"Order {order.order_id} amount mismatch: order expected {expected_kobo} kobo, paystack {amount_kobo}."
                    ))
                    failed_count += 1
                    continue
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Could not compare amounts for order {order.order_id}: {e}"))

            # At this point verification looks good
            if dry_run:
                self.stdout.write(self.style.SUCCESS(f"[dry-run] Order {order.order_id} WOULD be marked confirmed."))
                verified_count += 1
            else:
                order.payment_confirmed = True
                order.transaction_reference = reference
                order.save()
                self.stdout.write(self.style.SUCCESS(f"Order {order.order_id} marked confirmed."))
                verified_count += 1

        self.stdout.write(self.style.SUCCESS(f"Done. Verified: {verified_count}, Failed: {failed_count}"))
