# main_app/management/commands/fetch_zoho_accountid.py
import os
import requests
import logging
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fetch Zoho accountId using refresh token and print it (copy to your env).'

    def handle(self, *args, **options):
        client_id = os.getenv("ZOHO_CLIENT_ID")
        client_secret = os.getenv("ZOHO_CLIENT_SECRET")
        refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")
        redirect_uri = os.getenv("ZOHO_REDIRECT_URI", "")

        if not (client_id and client_secret and refresh_token):
            self.stderr.write(self.style.ERROR(
                "Please set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET and ZOHO_REFRESH_TOKEN env vars."
            ))
            return

        token_url = "https://accounts.zoho.com/oauth/v2/token"
        token_data = {
            "refresh_token": refresh_token,
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "refresh_token",
        }
        if redirect_uri:
            token_data["redirect_uri"] = redirect_uri

        try:
            token_resp = requests.post(token_url, data=token_data, timeout=15)
            token_resp.raise_for_status()
            access_token = token_resp.json().get("access_token")
            if not access_token:
                self.stderr.write(self.style.ERROR("No access_token returned from Zoho. Response: %s" % token_resp.text))
                return
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to obtain access token: {e}"))
            logger.exception("Failed to obtain Zoho access token")
            return

        try:
            accounts_url = "https://mail.zoho.com/api/accounts"
            headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
            acc_resp = requests.get(accounts_url, headers=headers, timeout=15)
            acc_resp.raise_for_status()
            data = acc_resp.json().get("data") or acc_resp.json().get("accounts") or acc_resp.json()
            # try to find accountId in response
            account_id = None
            if isinstance(data, list) and len(data) > 0:
                account_id = data[0].get("accountId") or data[0].get("account_id") or data[0].get("id")
            if not account_id:
                # fallback: try top-level 'data' path
                account_id = acc_resp.json().get("data", [{}])[0].get("accountId")
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to fetch Zoho accounts: {e}"))
            logger.exception("Failed to fetch Zoho accounts")
            return

        if account_id:
            self.stdout.write(self.style.SUCCESS("Zoho accountId: %s" % account_id))
            self.stdout.write("")
            self.stdout.write("✅ Add this to your Railway env vars as ZOHO_ACCOUNT_ID.")
            self.stdout.write("  e.g.\n    ZOHO_ACCOUNT_ID=%s" % account_id)
        else:
            self.stderr.write(self.style.ERROR("Could not find accountId in Zoho response."))
            self.stderr.write(self.style.ERROR("Full response: %s" % acc_resp.text))
