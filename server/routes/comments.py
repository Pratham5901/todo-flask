from flask import Blueprint, request, jsonify
from extensions import db
from models import Comment
comments_bp = Blueprint("comments", __name__, url_prefix="/api/comments")

@comments_bp.route("", methods=["POST"])
def create_comment():
    data = request.json
    comment = Comment(task_id=data["task_id"], content=data["content"])
    db.session.add(comment)
    db.session.commit()
    return jsonify({"id": comment.id, "content": comment.content}), 201

@comments_bp.route("/<int:comment_id>", methods=["PUT"])
def update_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    comment.content = request.json.get("content", comment.content)
    db.session.commit()
    return jsonify({"id": comment.id, "content": comment.content})

@comments_bp.route("/<int:comment_id>", methods=["DELETE"])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted"})

@comments_bp.route("/task/<int:task_id>", methods=["GET"])
def get_comments(task_id):
    comments = Comment.query.filter_by(task_id=task_id).all()
    return jsonify([{"id": c.id, "content": c.content} for c in comments])
