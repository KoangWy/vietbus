"""Application factory module.

Provides the create_app function that builds and configures the Flask app.
"""
from __future__ import annotations

import os
from flask import Flask, jsonify
from flask_cors import CORS
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.ticket import ticket_bp
from routes.schedule import schedule_bp

class DefaultConfig:
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = False
    SECRET_KEY = os.getenv("FLASK_SECRET", "change-me")
    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRES_IN_SECONDS = int(os.getenv("JWT_EXPIRES_IN_SECONDS", 60 * 60 * 24))
    # Add future config defaults here (e.g., DB pool sizes, feature flags)

# if create a new route, add here like below
def register_blueprints(app: Flask) -> None:
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(ticket_bp, url_prefix="/api/tickets")
    app.register_blueprint(schedule_bp, url_prefix="/api/schedule")

def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "not_found"}), 404

    @app.errorhandler(500)
    def internal_error(_):
        return jsonify({"error": "internal_server_error"}), 500


def create_app(config_object: object | None = None) -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  
    # Load config: provided object or fallback DefaultConfig
    app.config.from_object(config_object or DefaultConfig)

    register_blueprints(app)
    register_error_handlers(app)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    return app

__all__ = ["create_app", "DefaultConfig"]
