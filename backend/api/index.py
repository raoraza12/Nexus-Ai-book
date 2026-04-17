import os
import sys

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

# Vercel needs the app instance to be named 'app'
handler = app
