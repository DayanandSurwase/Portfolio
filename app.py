from flask import Flask, render_template, send_from_directory, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
import os
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

firebase_key_json = os.environ.get('FIREBASE_KEY_JSON')

if not firebase_admin._apps:
    cred_dict = json.loads(firebase_key_json)
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://my-portfolio-b8a2b-default-rtdb.asia-southeast1.firebasedatabase.app/"
    })

@app.route("/pages/<path:filename>")
def serve_page(filename):
    return send_from_directory("pages", filename)

@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not all([name, email, message]):
        return jsonify({"success": False, "error": "Missing fields"}), 400

    try:
        ref = db.reference("messages")
        ref.push({
            "name": name,
            "email": email,
            "message": message
        })
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=2812, debug=True)
