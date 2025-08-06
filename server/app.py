# app.py
from flask import Flask
from flask_cors import CORS
from extensions import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, origins=["*"])

db.init_app(app)

from models import Task, Comment
from routes.tasks import tasks_bp
from routes.comments import comments_bp

app.register_blueprint(tasks_bp)
app.register_blueprint(comments_bp)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
