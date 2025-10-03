import os
import logging
import requests
from django.template.loader import render_to_string
from django.conf import settings
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.utils.http import urlencode

logger = logging.getLogger(__name__)


# === Helper to get a fresh Zoho access token ===
def get_zoho_access_token():
    client_id = os.getenv("ZOHO_CLIENT_ID")
    client_secret = os.getenv("ZOHO_CLIENT_SECRET")
    refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")

    if not client_id or not client_secret or not refresh_token:
        raise Exception("Zoho OAuth env vars not set (ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN)")

    url = "https://accounts.zoho.com/oauth/v2/token"
    payload = {
        "grant_type": "refresh_token",
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
    }

    resp = requests.post(url, data=payload)
    resp.raise_for_status()
    data = resp.json()
    return data["access_token"]


# === Secure signed link generator ===
def generate_signed_link(order_order_id: int, path: str, domain: str, expires_in: int = 172800) -> str:
    """
    Create a signed URL that expires after `expires_in` seconds (default 48 hours).
    order_order_id: the value in Order.order_id (primary key)
    path: path starting with "/" (e.g. "/orders/123/view/")
    domain: domain only, no scheme (e.g. "tripleastechng.com")
    """
    signer = TimestampSigner()
    token = signer.sign(str(order_order_id))
    url = f"https://{domain}{path}?{urlencode({'token': token})}"
    return url


def validate_signed_token(token: str, max_age: int = 172800):
    """
    Validate a signed token (max_age default = 48h).
    Returns order_order_id (int) if valid, otherwise None.
    """
    signer = TimestampSigner()
    try:
        unsigned = signer.unsign(token, max_age=max_age)
        return int(unsigned)
    except SignatureExpired:
        logger.info("Signed token expired")
        return None
    except BadSignature:
        logger.warning("Bad signed token")
        return None


# === Generic Zoho send mail function ===
def send_zoho_mail(to_email, subject, plain_message, html_message=None):
    access_token = get_zoho_access_token()
    account_id = os.getenv("ZOHO_ACCOUNT_ID")

    if not account_id:
        raise Exception("ZOHO_ACCOUNT_ID not set in environment")

    url = f"https://mail.zoho.com/api/accounts/{account_id}/messages"

    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "fromAddress": f"Triple A's Technology <{os.getenv('EMAIL_HOST_USER')}>",
        "toAddress": to_email,
        "subject": subject,
        "content": plain_message,
        "mailFormat": "html" if html_message else "text",
    }

    if html_message:
        payload["content"] = html_message

    resp = requests.post(url, headers=headers, json=payload, timeout=20)

    if resp.status_code != 200:
        logger.error("Zoho Mail API error: %s", resp.text)
        raise Exception(f"Zoho Mail API error: {resp.text}")

    logger.info("Email sent to %s via Zoho API", to_email)
    return True


# === Helper: format prices with ₦ and thousand separators ===
def format_price(amount):
    try:
        # rounds/truncates decimals — use more precise formatting if needed
        return f"₦{int(round(float(amount))):,}"
    except Exception:
        return f"₦{amount}"


# === Order confirmation email ===
def send_order_email(user_email, order, request=None):
    """
    order is the Order model instance that has:
      - order.order_id (primary key)
      - order.user_id (FK to user) or None
      - order.total_amount, etc.
    """
    domain = request.get_host() if request else getattr(settings, "SITE_DOMAIN", "tripleastechng.com")

    try:
        # Try common related name; fallback to orderitem_set
        try:
            cart_items = order.cart_items.select_related("product").all()
        except Exception:
            cart_items = getattr(order, "orderitem_set").select_related("product").all()
    except Exception:
        cart_items = []

    subject = f"Order #{order.order_id} Received — Awaiting Payment"
    status_message = "We received your order and will notify you once payment is confirmed."

    # Build paths (explicit strings so reverse/name mismatches won't break)
    view_path = f"/orders/{order.order_id}/view/"
    cancel_path = f"/orders/{order.order_id}/cancel/"

    view_order_url = generate_signed_link(order.order_id, view_path, domain)
    cancel_order_url = generate_signed_link(order.order_id, cancel_path, domain)

    # --- Plain text email ---
    plain_items = ""
    if cart_items:
        plain_items += "\nOrder Items:\n"
        for item in cart_items:
            subtotal = item.quantity * item.price
            plain_items += f"- {item.product.name} (x{item.quantity}) — {format_price(subtotal)}\n"

    # Shipping info
    if order.shipping_method and "pick" in order.shipping_method.lower():
        shipping_info = (
            "\nPickup at Store:\n"
            "Triple A's Technology\n"
            "2 Oba Akran, Ikeja, Lagos\n"
            "Phone: +2348023975782\n"
        )
    else:
        shipping_info = (
            f"\nShipping To:\n"
            f"{order.first_name} {order.last_name}\n"
            f"{order.address}, {order.city}, {order.state}, {order.country} - {order.postal_code}\n"
            f"Phone: {order.phone}\n"
        )

    plain_message = (
        f"Thank you for your order!\n\n"
        f"Order ID: #{order.order_id}\n"
        f"Total: {format_price(order.total_amount)}\n\n"
        f"{status_message}\n"
        f"{plain_items}\n"
        f"{shipping_info}\n"
        f"View your order (48h): {view_order_url}\n"
        f"Cancel your order (48h): {cancel_order_url}\n\n"
        "Thanks for shopping with Triple A."
    )

    # --- HTML email ---
    html_message = render_to_string(
        "emails/order_confirmation.html",
        {
            "order": order,
            "cart_items": cart_items,
            "domain": domain,
            "view_order_url": view_order_url,
            "cancel_order_url": cancel_order_url,
            "status_message": status_message,
            "format_price": format_price,
        },
    )

    try:
        send_zoho_mail(user_email, subject, plain_message, html_message)
        logger.info("Order confirmation email sent (sync) to %s", user_email)
    except Exception as e:
        logger.exception("Failed to send order confirmation email to %s: %s", user_email, e)
        raise



# === Order status email ===
def send_order_status_email(user_email, order, request=None):
    domain = request.get_host() if request else getattr(settings, "SITE_DOMAIN", "tripleastechng.com")

    # Try fetching cart items like in confirmation
    try:
        try:
            cart_items = order.cart_items.select_related("product").all()
        except Exception:
            cart_items = getattr(order, "orderitem_set").select_related("product").all()
    except Exception:
        cart_items = []

    # Subject + status message
    if order.status == "ready_for_pickup":
        subject = f"Order #{order.order_id} — Ready for Pickup"
        status_message = "✅ Your order is ready for pickup! Address: 2 Oba Akran, Ikeja, Lagos"
    elif order.status == "shipped":
        subject = f"Order #{order.order_id} — Out for Delivery"
        status_message = "🚚 Your order has been shipped. Estimated delivery: 1–3 days."
    elif order.status == "delivered":
        subject = f"Order #{order.order_id} — Delivered"
        status_message = "📦 Your order has been delivered."
    elif order.status == "cancelled":
        subject = f"Order #{order.order_id} — Cancelled"
        status_message = "❌ Your order has been cancelled."
    else:
        subject = f"Update on Order #{order.order_id}"
        status_message = f"Your order status is now: {order.get_status_display()}"

    # Signed view link
    view_path = f"/orders/{order.order_id}/view/"
    view_order_url = generate_signed_link(order.order_id, view_path, domain)

    # --- Plain text email ---
    plain_items = ""
    if cart_items:
        plain_items += "\nOrder Items:\n"
        for item in cart_items:
            subtotal = item.quantity * item.price
            plain_items += f"- {item.product.name} (x{item.quantity}) — {format_price(subtotal)}\n"

    plain_message = (
        f"Hello {order.first_name},\n\n"
        f"{status_message}\n\n"
        f"Order Total: {format_price(order.total_amount)}\n"
        f"{plain_items}\n"
        f"View your order (48h): {view_order_url}\n\n"
        "Thank you for shopping with Triple A."
    )

    # --- HTML email ---
    html_message = render_to_string(
        "emails/order_status_update.html",
        {
            "order": order,
            "cart_items": cart_items,   # ✅ include cart items
            "status_message": status_message,
            "domain": domain,
            "view_order_url": view_order_url,
            "format_price": format_price,
        },
    )

    try:
        send_zoho_mail(user_email, subject, plain_message, html_message)
        logger.info("Order status email sent to %s", user_email)
    except Exception as e:
        logger.exception("Failed to send order status email to %s: %s", user_email, e)
        raise



# === Password reset email ===
def send_password_reset_email(user, reset_link):
    subject = "Reset Your Password — Triple A's Technology"
    plain_message = (
        f"Hello {user.first_name},\n\n"
        f"We received a request to reset your password.\n"
        f"Click below to reset:\n{reset_link}\n\n"
        "If you did not request this, ignore this email."
    )

    html_message = render_to_string("emails/password_reset.html", {"user": user, "reset_link": reset_link})

    try:
        send_zoho_mail(user.email, subject, plain_message, html_message)
    except Exception as e:
        logger.exception("Failed to send password reset email to %s: %s", user.email, e)
        raise
