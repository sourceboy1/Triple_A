# main_app/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .utils.email_helpers import send_order_email

@receiver(post_save, sender=Order)
def send_order_confirmation_email(sender, instance, created, **kwargs):
    if created:
        try:
            send_order_email(instance.user.email, instance)
            print(f"[INFO] Order confirmation email sent to {instance.user.email}")
        except Exception as e:
            print(f"[ERROR] Failed to send order email: {e}")
