# main_app/management/commands/send_test_email.py
import os
import logging
from django.core.management.base import BaseCommand
from main_app.utils.email_helpers import send_zoho_mail

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Send a test email via Zoho Mail API. Usage: python manage.py send_test_email --to=you@example.com"

    def add_arguments(self, parser):
        parser.add_argument("--to", type=str, help="Recipient email", required=False)
        parser.add_argument("--subject", type=str, help="Email subject", default="Zoho API Test Email")
        parser.add_argument("--text", type=str, help="Plain text body", default="This is a plain text test.")
        parser.add_argument("--html", type=str, help="HTML body", default="<p>This is an <strong>HTML</strong> test.</p>")

    def handle(self, *args, **options):
        to = options.get("to") or os.getenv("TEST_EMAIL_RECIPIENT") or "seunakanni417@gmail.com"
        subject = options.get("subject")
        text = options.get("text")
        html = options.get("html")

        try:
            ok = send_zoho_mail(to_email=to, subject=subject, plain_message=text, html_message=html)
            if ok:
                self.stdout.write(self.style.SUCCESS(f"Test email sent to {to}"))
            else:
                self.stderr.write(self.style.ERROR("send_zoho_mail returned False"))
        except Exception as e:
            logger.exception("Error sending test email")
            self.stderr.write(self.style.ERROR(f"Exception: {e}"))
