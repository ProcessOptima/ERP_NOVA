#!/usr/bin/env python
"""
Generate a new Django SECRET_KEY for production use.

Usage:
    python generate_secret_key.py
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("\n" + "="*70)
    print("NEW SECRET_KEY GENERATED")
    print("="*70)
    print(f"\n{secret_key}\n")
    print("="*70)
    print("IMPORTANT: Copy this key to your .env file:")
    print(f"SECRET_KEY={secret_key}")
    print("="*70 + "\n")
    print("⚠️  WARNING: Never commit this key to version control!")
    print("⚠️  WARNING: Change the old password immediately!\n")
