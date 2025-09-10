# ScentAI - Deployment Guide

## Overview
ScentAI is a complete AI-powered perfume recommendation system with a Flask backend API and React frontend web application. This guide covers deployment, setup, and operation.

## Architecture
- **Backend**: Flask API with SQLite database and AI recommendation engine
- **Frontend**: React web application with responsive design
- **AI Engine**: Utility maximization algorithm with skin chemistry analysis
- **Database**: User profiles, perfumes, recommendations, and feedback

## Backend Deployment

### Prerequisites
- Python 3.11+
- pip package manager
- Virtual environment support

### Setup Instructions

1. **Navigate to Backend Directory**
   ```bash
   cd perfume-ai-backend
   ```

2. **Activate Virtual Environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize Database**
   ```bash
   python src/data/populate_db.py
   ```

5. **Start Backend Server**
   ```bash
   python src/main.py
   ```
   - Server runs on `http://localhost:5000`
   - API endpoints available at `/api/*`

### API Endpoints

#### User Management
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user details
- `GET /api/users/{id}/profile` - Get user profile
- `POST /api/users/{id}/profile` - Save user profile

#### Perfume Database
- `GET /api/perfumes` - Get all perfumes
- `GET /api/perfumes/{id}` - Get specific perfume

#### AI Recommendations
- `POST /api/users/{id}/daily-recommendation` - Get single recommendation
- `POST /api/users/{id}/recommendations` - Get multiple recommendations
- `GET /api/users/{id}/recommendations/history` - Get recommendation history

#### Feedback System
- `POST /api/recommendations/{id}/feedback` - Submit user rating

## Frontend Deployment

### Prerequisites
- Node.js 20+
- pnpm package manager

### Setup Instructions

1. **Navigate to Frontend Directory**
   ```bash
   cd perfume-ai-frontend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm run dev --host
   ```
   - Application runs on `http://localhost:5173`

4. **Build for Production**
   ```bash
   pnpm run build
   ```
   - Production files in `dist/` directory

### Production Deployment Options

#### Option 1: Static Hosting
- Deploy `dist/` folder to any static hosting service
- Examples: Netlify, Vercel, GitHub Pages, AWS S3

#### Option 2: Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 5173
CMD ["pnpm", "run", "preview"]
```

## Mobile Development Path

### Current Status
- **Web App**: Fully functional responsive web application
- **PWA Ready**: Can be installed as Progressive Web App on mobile devices
- **Mobile Optimized**: Touch-friendly interface with mobile-first design

### Native Mobile Development

#### Flutter Conversion (Recommended)
1. **Setup Flutter Environment**
   ```bash
   flutter doctor
   ```

2. **Create Flutter Project**
   ```bash
   flutter create perfume_ai_mobile
   ```

3. **Key Components to Implement**
   - HTTP client for API communication
   - State management (Provider/Riverpod)
   - Local storage for offline capability
   - Push notifications for daily recommendations

#### React Native Alternative
- Convert existing React components
- Use React Navigation for routing
- Implement native device features

## Database Schema

### Users Table
- `id`: Primary key
- `email`: User email
- `created_at`: Registration date

### UserProfiles Table
- `user_id`: Foreign key to users
- `skin_type`: Dry/Balanced/Oily
- `preferred_families`: JSON array
- `budget_min/max`: Price range
- `allergies`: JSON array
- Additional skin chemistry parameters

### Perfumes Table
- `id`: Primary key
- `name`: Perfume name
- `brand`: Brand name
- `fragrance_family`: Category
- `top_notes/middle_notes/base_notes`: JSON arrays
- `price`: Retail price
- Performance metrics

### Recommendations Table
- `id`: Primary key
- `user_id`: Foreign key
- `perfume_id`: Foreign key
- `utility_score`: AI calculated score
- `predicted_longevity/projection/sillage`: Performance predictions
- `context_*`: Environmental context
- `user_rating`: Feedback (1-5 stars)

## AI Algorithm Configuration

### Key Parameters
- **Evaporation Rates**: Per fragrance family
- **Environmental Factors**: Temperature, humidity, airflow
- **Skin Chemistry**: pH, temperature, hydration
- **Utility Weights**: Projection vs longevity preferences

### Customization Options
- Adjust family evaporation rates in `recommendation_engine.py`
- Modify environmental impact factors
- Update utility calculation weights
- Add new fragrance families or notes

## Security Considerations

### Backend Security
- Input validation on all endpoints
- SQL injection prevention with SQLAlchemy ORM
- CORS configuration for frontend access
- Rate limiting for API endpoints

### Frontend Security
- Environment variables for API endpoints
- Input sanitization
- XSS prevention
- Secure HTTP headers

## Performance Optimization

### Backend Optimization
- Database indexing on frequently queried fields
- Caching for perfume data
- Async processing for AI calculations
- Connection pooling

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Service worker for offline capability

## Monitoring and Analytics

### Recommended Metrics
- User engagement rates
- Recommendation accuracy
- API response times
- User feedback scores
- Daily active users

### Implementation Options
- Google Analytics for web tracking
- Custom analytics API endpoints
- Performance monitoring tools
- Error tracking services

## Troubleshooting

### Common Backend Issues
- **Database Connection**: Check SQLite file permissions
- **Import Errors**: Verify virtual environment activation
- **Port Conflicts**: Change port in `main.py`

### Common Frontend Issues
- **Build Failures**: Clear node_modules and reinstall
- **API Connection**: Verify backend URL in API service
- **Component Errors**: Check browser console for details

### AI Recommendation Issues
- **No Recommendations**: Check user profile completeness
- **Poor Recommendations**: Verify perfume database population
- **Performance Issues**: Optimize utility calculation algorithm

## Scaling Considerations

### Database Scaling
- Migrate from SQLite to PostgreSQL/MySQL
- Implement database sharding
- Add read replicas for performance

### API Scaling
- Implement load balancing
- Add Redis caching layer
- Use microservices architecture
- Deploy with container orchestration

### Frontend Scaling
- CDN for static assets
- Server-side rendering (SSR)
- Progressive Web App features
- Offline functionality

## Support and Maintenance

### Regular Maintenance Tasks
- Database backup and cleanup
- Security updates
- Performance monitoring
- User feedback analysis

### Update Procedures
- Backend API versioning
- Database migration scripts
- Frontend deployment pipeline
- Mobile app store updates

## Conclusion

ScentAI is a production-ready AI perfume recommendation system with comprehensive features for user profiling, intelligent recommendations, and feedback collection. The modular architecture supports easy scaling and customization for different deployment scenarios.

For technical support or customization requests, refer to the codebase documentation and API specifications.

