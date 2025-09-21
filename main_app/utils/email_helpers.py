# main_app/utils/email_helpers.py
import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

def send_order_email(user_email, order, request=None):
    """
    Initial order placed email (sent immediately after order creation).
    This informs the customer that the order was received and that payment
    must be confirmed before it's processed.
    """
    domain = request.get_host() if request else getattr(settings, 'SITE_DOMAIN', 'tripleastechng.com')

    # Try to get cart items in a safe way
    try:
        cart_items = order.cart_items.select_related("product").all()
    except Exception:
        # fallback if your related_name is different
        cart_items = getattr(order, 'orderitem_set').select_related("product").all()

    subject = f"Order #{order.order_id} Received — Awaiting Payment"
    status_message = "We received your order and will notify you once payment is confirmed."

    plain_message = (
        f"Thank you for your order!\n\n"
        f"Order ID: #{order.order_id}\n"
        f"Total: ₦{order.total_amount}\n\n"
        f"{status_message}\n\n"
        f"View your order: https://{domain}/order/{order.order_id}\n"
        f"Cancel your order: https://{domain}/order/{order.order_id}/cancel\n\n"
        "Thanks for shopping with Triple A."
    )

    html_message = render_to_string('emails/order_confirmation.html', {
        'order': order,
        'cart_items': cart_items,
        'domain': domain,
        'view_order_url': f"https://{domain}/order/{order.order_id}",
        'cancel_order_url': f"https://{domain}/order/{order.order_id}/cancel",
        'status_message': status_message,
    })

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info("Order confirmation email sent to %s", user_email)
        print(f"[INFO] Order confirmation email sent to {user_email}")
    except Exception as e:
        logger.exception("Failed to send order confirmation email to %s: %s", user_email, e)
        print(f"[ERROR] Failed to send order email: {e}")


def send_order_status_email(user_email, order, request=None):
    """
    Sends an order status update email (ready for pickup / shipped / delivered / cancelled).
    This should be triggered only from the admin actions (or wherever you decide).
    """
    domain = request.get_host() if request else getattr(settings, 'SITE_DOMAIN', 'tripleastechng.com')

    # Pick subject and message based on order.status
    if order.status == "ready_for_pickup":
        subject = f"Order #{order.order_id} — Ready for Pickup"
        status_message = (
            "✅ Your order is ready for pickup!\n\n"
            "Pickup Address:\n"
            "2 Oba Akran, Ikeja, Lagos\n"
            "Phone: +2348023975782"
        )
    elif order.status == "shipped":
        subject = f"Order #{order.order_id} — Out for Delivery"
        status_message = (
            "🚚 Your order has been shipped and is on its way!\n"
            "Estimated delivery: 1–3 business days."
        )
    elif order.status == "delivered":
        subject = f"Order #{order.order_id} — Delivered"
        status_message = "📦 Your order has been delivered. Enjoy your purchase!"
    elif order.status == "cancelled":
        subject = f"Order #{order.order_id} — Cancelled"
        status_message = "❌ Your order has been cancelled. Contact support if this is unexpected."
    else:
        subject = f"Update on Order #{order.order_id}"
        status_message = f"Your order status is now: {order.get_status_display()}"

    plain_message = (
        f"Hello {order.first_name},\n\n"
        f"{status_message}\n\n"
        f"View your order: https://{domain}/order/{order.order_id}\n\n"
        "Thank you for shopping with Triple A."
    )

    html_message = render_to_string('emails/order_status_update.html', {
        'order': order,
        'status_message': status_message,
        'domain': domain,
        'view_order_url': f"https://{domain}/order/{order.order_id}",
    })

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info("Order status update email sent to %s (status=%s)", user_email, order.status)
        print(f"[INFO] Order status update email sent to {user_email} (status: {order.status})")
    except Exception as e:
        logger.exception("Failed to send order status update email to %s: %s", user_email, e)
        print(f"[ERROR] Failed to send status update email to {user_email}: {e}")


def send_password_reset_email(user, reset_link):
    """
    Sends a password reset email to the user.
    """
    subject = "Reset Your Password — Triple A's Technology"
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    plain_message = (
        f"Hello {user.first_name},\n\n"
        f"We received a request to reset your password.\n"
        f"Click the link below to reset your password:\n"
        f"{reset_link}\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        "Thanks,\nTriple A's Technology"
    )

    html_message = render_to_string('emails/password_reset.html', {
        'user': user,
        'reset_link': reset_link
    })

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False
        )
        logger.info("Password reset email sent to %s", user.email)
    except Exception as e:
        logger.exception("Failed to send password reset email to %s: %s", user.email, e)