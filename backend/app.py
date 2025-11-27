"""Backend application entrypoint.

Creates the Flask app via the central factory. All blueprint
registration happens inside `backend.factory.create_app`.
Run with: `python backend/app.py` from project root.
"""

from factory import create_app, DefaultConfig

app = create_app(DefaultConfig)

if __name__ == "__main__":
    app.run(debug=True)
