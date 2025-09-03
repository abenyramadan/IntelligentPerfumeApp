# app/__init__.py
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from .db import init_db, db
from .user import User
from .user_profile import UserProfile
from .perfume import Perfume
from .recommendation import Recommendation
from .questionnaire import QuestionnaireResponse

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # Emotional question endpoint using OpenAI (must be after app is created)
    from .recommendation_engine import generate_emotional_question
    @app.route('/api/emotional-question', methods=['POST'])
    def emotional_question():
        data = request.get_json() or {}
        user_context = data.get('user_context', {})
        prompt = data.get('prompt')
        question = generate_emotional_question(user_context, prompt)
        return jsonify({'question': question})
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
    # Always send CORS headers on errors
    @app.errorhandler(Exception)
    def handle_exception(e):
        origin = request.headers.get('Origin')
        allowed = ['http://localhost:5173', 'http://127.0.0.1:5173']
        response = jsonify({'error': str(e)})
        response.status_code = getattr(e, 'code', 500)
        if origin in allowed:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Vary'] = 'Origin'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        return response

    # Proxy to Fragella API for top 3 recommendations
    @app.route('/api/fragella/top3', methods=['POST'])
    def fragella_top3():
        import requests
        data = request.get_json() or {}
        # Example: expects 'accords', 'top', 'middle', 'base' in data
        url = 'https://api.fragella.com/api/v1/fragrances/match'
        headers = {
            'x-api-key': '633539ff693d3acd022dd9d135f3cff9ce016478c7d0536fd8d488dee39942c4'
        }
        params = {
            'limit': 3,
            'accords': data.get('accords', 'floral:100,fruity:90,citrus:80'),
            'top': data.get('top', 'Pear,Bitter Orange,Bergamot'),
            'middle': data.get('middle', 'Freesia'),
            'base': data.get('base', 'Iso E Super')
        }
        resp = requests.get(url, headers=headers, params=params)
        resp.raise_for_status()
        # Map Fragella response to frontend format
        results = []
        for item in resp.json():
            results.append({
                'Name': item.get('Name'),
                'Brand': item.get('Brand'),
                'Image URL': item.get('Image URL'),
                'Price': item.get('Price'),
                'Main Accords': item.get('Main Accords'),
                'Notes': item.get('Notes'),
                'PurchaseURL': item.get('Purchase URL'),
                'Longevity': item.get('Longevity'),
                'Sillage': item.get('Sillage')
            })
        return jsonify(results)
    app = Flask(__name__)
    # ...existing code...

    # Proxy POST to Fragella for top 3 matches
    @app.route('/api/fragella/top3', methods=['POST'])
    def fragella_top3():


        import requests
        import sys
        data = request.get_json() or {}
        # Map profile data to Fragella query params
        # Map profile data to Fragella traits
        # Example mapping: use preferred_families for accords, and some defaults for notes
        accords = ','.join(data.get('preferred_families', [])) if data.get('preferred_families') else 'floral:100,fruity:90,citrus:80'
        top = 'Pear,Bitter Orange,Bergamot'
        middle = 'Freesia'
        base = 'Iso E Super'
        params = {
            'limit': 3,
            'accords': accords,
            'top': top,
            'middle': middle,
            'base': base
        }
        url = 'https://api.fragella.com/api/v1/fragrances/match'
        headers = {
            'x-api-key': '633539ff693d3acd022dd9d135f3cff9ce016478c7d0536fd8d488dee39942c4'
        }
        print('Proxying to Fragella with params:', params, file=sys.stderr)
        try:
            resp = requests.get(url, headers=headers, params=params)
            print('Fragella response status:', resp.status_code, file=sys.stderr)
            print('Fragella response body:', resp.text, file=sys.stderr)
            resp.raise_for_status()
            return jsonify(resp.json())
        except Exception as e:
            print('Fragella error:', str(e), file=sys.stderr)
            return jsonify({'error': str(e)}), 500
    # ...existing code...

    # Proxy to Fragella fragrance recommendation
    import requests
    @app.route('/api/ai-recommendations', methods=['POST'])
    def ai_recommendations():
        data = request.get_json() or {}
        user_id = data.get('user_id')
        # Fetch latest questionnaire answers if user_id is provided
        preferred_families = None
        top_notes = None
        middle_notes = None
        base_notes = None
        if user_id:
            answers = QuestionnaireResponse.query.filter_by(user_id=user_id).order_by(QuestionnaireResponse.created_at.desc()).all()
            for ans in answers:
                if ans.question_id == 'preferred_families' and ans.answer_text:
                    preferred_families = ans.answer_text
                if ans.question_id == 'top_notes' and ans.answer_text:
                    top_notes = ans.answer_text
                if ans.question_id == 'middle_notes' and ans.answer_text:
                    middle_notes = ans.answer_text
                if ans.question_id == 'base_notes' and ans.answer_text:
                    base_notes = ans.answer_text
        accords = preferred_families or data.get('accords', 'floral:100,fruity:90,citrus:80')
        top = top_notes or data.get('top', 'Pear,Bitter Orange,Bergamot')
        middle = middle_notes or data.get('middle', 'Freesia')
        base = base_notes or data.get('base', 'Iso E Super')
        url = f"https://api.fragella.com/api/v1/fragrances/match?accords={accords}&top={top}&middle={middle}&base={base}&limit=10"
        headers = {
            "x-api-key": "633539ff693d3acd022dd9d135f3cff9ce016478c7d0536fd8d488dee39942c4"
        }
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            fragella_results = response.json()
            # Map Fragella response to frontend format
            results = []
            for item in fragella_results:
                results.append({
                    'name': item.get('Name'),
                    'brand': item.get('Brand'),
                    'image_url': item.get('Image URL'),
                    'price': item.get('Price'),
                    'main_accords': item.get('Main Accords'),
                    'notes': item.get('Notes'),
                    'purchase_url': item.get('Purchase URL'),
                    'longevity': item.get('Longevity'),
                    'sillage': item.get('Sillage')
                })
            return jsonify(results)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Database configuration
    database_url = os.getenv('DATABASE_URL') or 'postgresql+psycopg2://abeny:abeny2002@localhost:5432/ScentAI'
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    init_db(app)

    # Create tables if not exist
    with app.app_context():
        db.create_all()

    # Root route
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({"message": "ScentAI API is running", "version": "1.0.0"})

    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({"status": "ok"})

    # Ensure CORS headers are present even on errors
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        allowed = ['http://localhost:5173', 'http://127.0.0.1:5173']
        if origin in allowed:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Vary'] = 'Origin'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        if request.method == 'OPTIONS':
            response.status_code = 200
        return response

    # Login endpoint
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"error": "username and password are required"}), 400
        
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid username or password"}), 401
        
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        }), 200

    # Create a user
    @app.route('/api/users', methods=['POST'])
    def create_user():
        data = request.get_json() or {}
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({"error": "username, email, and password are required"}), 400

        existing = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing:
            return jsonify({"error": "User with same username or email already exists"}), 409

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201

    # Get a user
    @app.route('/api/users/<int:user_id>', methods=['GET'])
    def get_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())

    # Get or update user profile
    @app.route('/api/users/<int:user_id>/profile', methods=['GET', 'POST'])
    def user_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if request.method == 'GET':
            profile = UserProfile.query.filter_by(user_id=user_id).first()
            if not profile:
                return jsonify({"error": "Profile not found"}), 404
            return jsonify(profile.to_dict())

        if request.method == 'POST':
            data = request.get_json() or {}
            profile = UserProfile.query.filter_by(user_id=user_id).first()
            if not profile:
                profile = UserProfile(user_id=user_id)
                db.session.add(profile)

            # Example of mapping fields (expand as needed)
            defaults = {
                'skin_type': 'Balanced',
                'skin_temperature': 'Neutral',
                'skin_hydration': 'Medium',
                'primary_climate': 'Temperate',
                'avg_temperature': '15-25',
                'avg_humidity': '30-60',
                'typical_environment': 'Indoor-ventilated',
                'preferred_intensity': 'Moderate',
                'longevity_target': 6,
                'gender_presentation': 'Unisex',
                'preferred_character': None,
                'projection_goal': "Arm's length",
                'sillage_tolerance_hot': 'Medium',
                'seasonal_focus': 'All-year',
                'budget_min': 0.0,
                'budget_max': 300.0,
                'allergies': None,
                'headache_triggers': None,
                'self_anosmia_musks': None,
                'sensitivity_sweetness': 'Medium',
                'sensitivity_projection': 'Medium',
                'number_of_sprays': 2,
                'preferred_concentration': 'EDT',
                'spray_location': 'Skin only',
                'fabric_type': None,
                'time_window_start': 0,
                'time_window_end': 8,
                'projection_weight': 1.0,
                'ventilation': None,
                'airflow': None,
            }

            for field, default_value in defaults.items():
                incoming = data.get(field)
                current = getattr(profile, field, None)
                if incoming is not None:
                    setattr(profile, field, incoming)
                elif current is None:
                    setattr(profile, field, default_value)

            # Multi-selects stored as comma-separated strings
            if 'preferred_families' in data:
                val = data.get('preferred_families')
                if isinstance(val, list):
                    profile.preferred_families = ','.join(val)
                elif isinstance(val, str):
                    profile.preferred_families = val
            if 'disliked_families' in data:
                val = data.get('disliked_families')
                if isinstance(val, list):
                    profile.disliked_families = ','.join(val)
                elif isinstance(val, str):
                    profile.disliked_families = val
            db.session.commit()
            return jsonify(profile.to_dict())

    # Questionnaire endpoints
    @app.route('/api/users/<int:user_id>/questionnaire', methods=['GET', 'POST'])
    def questionnaire(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if request.method == 'GET':
            responses = QuestionnaireResponse.query.filter_by(user_id=user_id).order_by(QuestionnaireResponse.created_at.desc()).all()
            return jsonify([r.to_dict() for r in responses])

        if request.method == 'POST':
            data = request.get_json() or {}
            question_id = data.get('question_id')
            if not question_id:
                return jsonify({"error": "question_id is required"}), 400
            # Check user existence before saving response
            user = User.query.get(user_id)
            if not user:
                return jsonify({"error": f"User with id {user_id} does not exist."}), 404

            response = QuestionnaireResponse(
                user_id=user_id,
                question_id=question_id,
                answer_text=data.get('answer_text'),
                answer_number=data.get('answer_number'),
                answer_json=data.get('answer_json')
            )
            db.session.add(response)
            db.session.commit()
            return jsonify(response.to_dict()), 201

    # Static questionnaire questions served by backend (so frontend isn't hardcoded)
    @app.route('/api/questionnaire/questions', methods=['GET'])
    def questionnaire_questions():
        questions = [
            {"id": "skin_type", "label": "Skin Type", "type": "select", "options": ["Dry", "Balanced", "Oily"], "multiple": False},
            {"id": "skin_temperature", "label": "Skin Temperature", "type": "select", "options": ["Cool", "Neutral", "Warm"], "multiple": False},
            {"id": "preferred_families", "label": "Preferred Families (choose up to 3)", "type": "select", "options": ["Citrus","Green","Aromatic","Floral","White Floral","Fruity","Chypre","Woody","Amber","Oriental/Spicy","Leather","Musk"], "multiple": True, "max": 3},
            {"id": "longevity_target", "label": "Longevity Target (hours)", "type": "number", "min": 2, "max": 24, "step": 1}
        ]
        return jsonify(questions)

    # Get all users (for debugging/testing)
    @app.route('/api/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    # Recommendations - generate simple recommendations based on available perfumes
    @app.route('/api/users/<int:user_id>/recommendations', methods=['GET', 'POST'])
    def generate_recommendations(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        perfumes = Perfume.query.all()
        results = []
        for perfume in perfumes[:6]:
            # Create a Recommendation record (lightweight)
            rec = Recommendation(user_id=user.id, perfume_id=perfume.id)
            db.session.add(rec)
            db.session.flush()

            results.append({
                "recommendation_id": rec.id,
                "perfume": perfume.to_dict(),
                "predictions": {
                    "longevity": 6.0,
                    "projection": 6.0,
                    "sillage": 6.0,
                    "utility_score": 6.0,
                    "pleasantness": 6.0
                },
                "explanation": "Baseline recommendation based on availability"
            })

        db.session.commit()
        return jsonify(results)

    @app.route('/api/users/<int:user_id>/daily-recommendation', methods=['POST'])
    def daily_recommendation(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get latest questionnaire answers
        answers = QuestionnaireResponse.query.filter_by(user_id=user_id).order_by(QuestionnaireResponse.created_at.desc()).all()
        # Example: try to match preferred family, intensity, longevity, etc.
        preferred_family = None
        preferred_intensity = None
        longevity_target = None
        for ans in answers:
            if ans.question_id == 'preferred_families' and ans.answer_text:
                preferred_family = ans.answer_text.split(',')[0] if ans.answer_text else None
            if ans.question_id == 'preferred_intensity' and ans.answer_text:
                preferred_intensity = ans.answer_text
            if ans.question_id == 'longevity_target' and ans.answer_number:
                longevity_target = ans.answer_number

        query = Perfume.query
        if preferred_family:
            query = query.filter(Perfume.fragrance_family.ilike(f'%{preferred_family}%'))
        if preferred_intensity:
            query = query.filter(Perfume.intensity.ilike(f'%{preferred_intensity}%'))
        if longevity_target:
            query = query.filter(Perfume.longevity_hours >= longevity_target)

        perfume = query.first()
        if not perfume:
            perfume = Perfume.query.first()
            explanation = "No exact match found, showing first available perfume."
        else:
            explanation = "Matched to your latest questionnaire answers."

        rec = Recommendation(user_id=user.id, perfume_id=perfume.id)
        db.session.add(rec)
        db.session.commit()

        return jsonify({
            "recommendation_id": rec.id,
            "perfume": perfume.to_dict(),
            "predictions": {
                "longevity": perfume.longevity_hours,
                "projection": 7.0,
                "sillage": 7.0,
                "utility_score": 7.0,
                "pleasantness": 7.0
            },
            "explanation": explanation
        })

    @app.route('/api/users/<int:user_id>/recommendations/history', methods=['GET'])
    def recommendations_history(user_id):
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        pagination = Recommendation.query.filter_by(user_id=user.id) \
            .order_by(Recommendation.recommendation_date.desc()) \
            .paginate(page=page, per_page=per_page, error_out=False)

        items = []
        for rec in pagination.items:
            perfume = Perfume.query.get(rec.perfume_id)
            items.append({
                "recommendation": rec.to_dict(),
                "perfume": perfume.to_dict() if perfume else None
            })

        return jsonify({
            "recommendations": items,
            "page": page,
            "per_page": per_page,
            "total": pagination.total
        })

    @app.route('/api/recommendations/<int:rec_id>/feedback', methods=['POST'])
    def recommendation_feedback(rec_id):
        data = request.get_json() or {}
        rating = data.get('rating')
        notes = data.get('notes')

        rec = Recommendation.query.get(rec_id)
        if not rec:
            return jsonify({"error": "Recommendation not found"}), 404

        if rating is not None:
            rec.user_rating = int(rating)
        if notes is not None:
            rec.user_notes = notes
        rec.feedback_date = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Feedback saved"})

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return app
