from flask import Flask, render_template, send_from_directory, request, jsonify
import firebase_admin
from firebase_admin import credentials, db
import os
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

firebase_key_json = os.environ.get('FIREBASE_KEY_JSON')

if not firebase_admin._apps:
    try:
        cred_dict = json.loads(firebase_key_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://my-portfolio-b8a2b-default-rtdb.asia-southeast1.firebasedatabase.app/"
        })
        print("[INFO] Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"[ERROR] Firebase Admin initialization failed: {e}")

# Serve static HTML pages from /pages folder
@app.route("/pages/<path:filename>")
def serve_page(filename):
    return send_from_directory("pages", filename)

# Handle contact form submissions
@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    print(f"[DEBUG] Contact form data received: {data}")

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
        print("[INFO] Message saved to Firebase successfully.")
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"[ERROR] Failed to save message: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Serve index.html for SPA
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")

# Start Flask
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 2812))  
    app.run(host='0.0.0.0', port=port, debug=False)
