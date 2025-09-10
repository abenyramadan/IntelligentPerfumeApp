# AI Algorithm and Recommendation System Architecture Design

## 1. Introduction

This document outlines the proposed AI algorithm and overall system architecture for the intelligent AI-based perfume recommendation mobile application. The application aims to provide personalized perfume recommendations to users based on their unique skin chemistry, environmental factors, personal preferences, and daily activities. The core of this system lies in its ability to process diverse user inputs and leverage AI models to predict and suggest optimal fragrance choices.

## 2. Data Inputs and Feature Engineering

The system will rely on a comprehensive set of user-provided data, categorized as follows:

### 2.1. Skin/Body Chemistry Data

Based on the `Skin.docx` document, the following inputs will be collected from the user:

*   **Skin Type (Oiliness):** Dry, Balanced, Oily
*   **Skin Temperature:** Cool, Neutral, Warm
*   **Skin Hydration:** Low, Medium, High
*   **Skin pH (if known):** Acidic (<5.5), Neutral (~5.5), Slightly Alkaline (>6), Unknown
*   **Recent Body State (last 6h):** No caffeine/alcohol, Caffeine, Alcohol, Both

These inputs are crucial as skin chemistry significantly influences how a perfume interacts and performs [1]. For instance, oily skin tends to enhance longevity, while higher temperatures can accelerate evaporation [1].

### 2.2. Climate & Environmental Data

Environmental factors play a vital role in perfume performance. The application will gather:

*   **Primary Climate:** Hot & Humid, Hot & Dry, Temperate, Cold
*   **Average Ambient Temperature (°C):** <15, 15–25, 26–32, >32
*   **Average Humidity (%):** <30, 30–60, >60
*   **Typical Environment:** Outdoor, Indoor-still, Indoor-AC, Indoor-ventilated
*   **Ventilation (indoors):** Low (ACH<1), Medium (1–3), High (>3)
*   **Airflow near you:** Still, Normal, Breezy

These factors directly impact a fragrance's projection, sillage, and longevity [2]. For example, high humidity can enhance longevity, while dry weather can cause perfumes to fade faster [2].

### 2.3. User Preferences

Personal preferences are subjective but essential for accurate recommendations:

*   **Preferred Fragrance Families (up to 3):** Citrus, Green, Aromatic, Floral, White Floral, Fruity, Chypre, Woody, Amber, Oriental/Spicy, Leather, Musk
*   **Disliked Families (exclude any):** Same list as above
*   **Preferred Intensity:** Skin scent, Moderate, Strong
*   **Longevity Target (hours):** 3–4, 6, 8, 10+
*   **Gender Presentation:** Feminine, Masculine, Unisex
*   **Preferred Character:** Fresh/Clean, Smooth/Creamy, Spicy/Warm, Sweet/Vanillic, Smoky/Leathery, Airy/Woody
*   **Projection Goal:** Close to skin, Arm’s length, Room-filling
*   **Sillage Tolerance in Hot Weather:** Low, Medium, High
*   **Seasonal Focus:** Summer, Winter, All-year
*   **Budget per bottle (USD):** <$80, $80–150, $150–300, $300+

### 2.4. Sensitivities & Allergies

Critical for user safety and comfort:

*   **Allergies/Intolerances:** Citrus oils, Aldehydes, Iso E Super, Ambroxan, Musks, Lavender, None
*   **Headache Triggers:** Aldehydes, White musks, Ambroxan, Very sweet, None
*   **Self-anosmia to musks:** Yes, No, Unsure
*   **Sensitivity to sweetness:** Low, Medium, High
*   **Sensitivity to projection:** Low, Medium, High

### 2.5. Dose & Application

These inputs provide context for how the user applies perfume:

*   **Number of sprays:** 1, 2, 3, 4, 5+
*   **Concentration:** EDT, EDP, Parfum, Extrait
*   **Spray location:** Skin only, Clothes only, Mix
*   **Fabric if used:** Cotton, Wool, Synthetic, Blend

### 2.6. Decision Window & Weighting

These inputs allow for fine-tuning the recommendation based on user priorities:

*   **Time window you care about:** 0–2h, 1–4h, 2–6h, 4–10h+
*   **Projection weight λ (how much you value sillage vs self-smell):** Low (≈0.2), Medium (≈1.0), High (≈2.0)

## 3. AI Algorithm Design

The core of the application will be an AI algorithm that processes the collected user data to generate personalized perfume recommendations. This will involve a multi-faceted approach, combining rule-based logic, machine learning, and potentially advanced techniques for olfactory data analysis.

### 3.1. Rule-Based System (Initial Filtering)

An initial rule-based system will filter out unsuitable perfumes based on explicit user inputs, particularly sensitivities, allergies, and disliked fragrance families. This ensures that no harmful or unpleasant recommendations are made.

*   **Allergy/Intolerance Filter:** Exclude perfumes containing ingredients the user is allergic to.
*   **Disliked Family Filter:** Exclude perfumes belonging to fragrance families the user dislikes.
*   **Budget Filter:** Filter perfumes outside the user's specified budget.

### 3.2. Machine Learning Model (Core Recommendation Engine)

The primary recommendation engine will be a machine learning model trained on a comprehensive dataset of perfumes and their characteristics, along with user feedback (implicit and explicit). The model will learn the complex relationships between user inputs and perfume performance/preference.

**Potential Machine Learning Approaches:**

*   **Collaborative Filtering:** This approach would recommend perfumes based on the preferences of similar users. If User A and User B have similar skin types, preferences, and environmental conditions, and User A likes Perfume X, then Perfume X might be recommended to User B.
*   **Content-Based Filtering:** This method recommends perfumes that are similar to those the user has liked in the past. It would analyze the characteristics of preferred perfumes (fragrance notes, families, intensity, etc.) and suggest new ones with similar attributes.
*   **Hybrid Recommendation System:** A combination of collaborative and content-based filtering would likely yield the best results, leveraging the strengths of both approaches.
*   **Regression Models:** To predict numerical values like longevity, projection, and self-pleasantness based on user inputs and perfume characteristics. This would be particularly relevant for integrating the formulas from `formulas-perfumes.docx`.
*   **Classification Models:** To categorize perfumes into 


categories (e.g., suitable for hot and humid climate, suitable for oily skin).

**Integration of Formulas from `formulas-perfumes.docx`:**

The `formulas-perfumes.docx` document introduces a utility function for choosing a perfume by maximizing a utility over a target window `[t1, t2]`, where `λ` controls the weighting between sillage and self-enjoyment. This suggests a quantitative approach to evaluating perfume performance.

*   **Pself(t) (self-pleasantness curve over time):** This curve is influenced by note evaporation dynamics, personal weights (`wi`), and an adaptation factor (`Gg(t)`). To integrate this, the AI model would need to:
    *   **Model Note Evaporation:** This requires a database of perfume notes and their typical evaporation rates (top, mid, base notes). This could be based on existing perfumery data or learned from user feedback.
    *   **Incorporate Personal Weights:** The user's preferred and disliked fragrance families, as well as their sensitivity to sweetness and projection, can be used to derive these personal weights. For example, if a user dislikes 


a certain note, its weight (`wi`) would be negative.
    *   **Adaptation Factor:** This accounts for phenomena like self-anosmia to musks. The model would need to adjust the perceived pleasantness over time based on the user's reported anosmia.

*   **S(t) (projection/sillage curve):** This curve is derived from evaporation rate constants, vapor pressure, diffusivity weights, and environmental factors. To integrate this, the AI model would need to:
    *   **Perfume Component Analysis:** A database of perfume components (molecules) and their physical properties (vapor pressure, diffusivity) would be required.
    *   **Environmental Impact Modeling:** The model would need to simulate how temperature, humidity, and airflow affect the evaporation and diffusion of these components.
    *   **Approximation from Family-Level Defaults:** As suggested in the document, initial approximations could be made based on fragrance family characteristics, refined by more detailed component analysis.

*   **Utility Maximization:** The AI will use the calculated `Pself(t)` and `S(t)` curves, along with the user-defined `λ` (projection weight), to calculate a utility score for each potential perfume over the user's specified time window `[t1, t2]`. The perfume with the highest utility score would be the primary recommendation.

### 3.3. Daily Fragrance Guidance (Reinforcement Learning/Contextual Bandits)

To make the app intelligent and useful for daily activities, a dynamic recommendation system will be implemented. This could involve:

*   **Contextual Information:** Beyond initial user inputs, the app will consider real-time data such as current weather, user's current activity (e.g., working out, attending a formal event), and even mood (if self-reported).
*   **User Feedback Loop:** The app will continuously learn from user interactions. If a user consistently rates a recommended perfume highly in certain situations, the model will reinforce that association. Conversely, negative feedback will lead to adjustments.
*   **Reinforcement Learning:** This approach would allow the AI to learn optimal fragrance choices for different daily contexts through trial and error, maximizing user satisfaction over time. The 


AI could suggest a perfume, and the user's subsequent rating or continued use would serve as a reward signal.
*   **Contextual Bandits:** This is a specific type of reinforcement learning suitable for personalized recommendations, where the system learns to choose the best 


action (perfume recommendation) based on the current context (user, environment, activity).

### 3.4. AI Model Training and Data Sources

Training the AI model will require a substantial dataset. Potential data sources include:

*   **Perfume Database:** A comprehensive database of perfumes, including their fragrance notes (top, middle, base), fragrance families, intensity, projection, sillage, and chemical compositions. This data can be sourced from publicly available perfume encyclopedias, industry databases, and potentially through partnerships with perfume manufacturers.
*   **User Interaction Data:** Anonymous data collected from users of the application, including their inputs (skin type, preferences, etc.), the perfumes they try, and their feedback (ratings, longevity observations, projection feedback). This will be crucial for training and fine-tuning the recommendation engine.
*   **Expert Knowledge:** Incorporating knowledge from perfumers and fragrance experts to establish initial rules and validate model outputs.
*   **Scientific Literature:** Data from studies on skin chemistry, olfaction, and fragrance performance.

## 4. System Architecture

The application will follow a client-server architecture, with the mobile application acting as the client and a backend server hosting the AI models and data.

### 4.1. Mobile Application (Client-Side)

*   **User Interface (UI):** Intuitive and user-friendly interface for collecting user inputs (questionnaires), displaying recommendations, and allowing users to provide feedback.
*   **Data Collection Module:** Securely collects user data and sends it to the backend.
*   **Local Processing (Optional):** For very basic, real-time feedback or pre-filtering, some lightweight AI models could potentially run on the device.
*   **Cross-Platform Development:** As identified in the research phase, **Flutter** or **React Native** are strong candidates for cross-platform development, allowing for a single codebase for both iOS and Android. Both frameworks have good support for AI integration [3].

### 4.2. Backend Server

*   **API Gateway:** Manages requests from the mobile application.
*   **User Management Service:** Handles user authentication and profiles.
*   **Data Storage:** Databases for storing user profiles, perfume data, and interaction logs.
    *   **Relational Database (e.g., PostgreSQL):** For structured user data and perfume metadata.
    *   **NoSQL Database (e.g., MongoDB):** For flexible storage of complex perfume profiles and user interaction logs.
*   **AI Recommendation Engine:** Hosts the trained machine learning models. This service will receive user inputs, process them, and return perfume recommendations.
*   **Perfume Data Management Service:** Manages the perfume database, including data ingestion, updates, and retrieval.
*   **Environmental Data Integration:** Potentially integrates with external APIs for real-time weather data based on user location.

### 4.3. AI Model Deployment

*   **Cloud-based Deployment:** Deploying AI models on cloud platforms (e.g., Google Cloud AI Platform, AWS SageMaker, Azure Machine Learning) offers scalability, managed services, and integration with other cloud services.
*   **Containerization (e.g., Docker):** Packaging the AI models and their dependencies into containers for consistent deployment across different environments.
*   **Orchestration (e.g., Kubernetes):** For managing and scaling the deployed AI services.

## 5. Daily Usage and Intelligence

To make the app intelligent and desired for daily use, beyond the initial recommendation:

*   **Daily Fragrance Check-in:** Prompt users to log their current activities, mood, and environment. Based on this, the app can suggest a suitable fragrance from their existing collection or recommend a new one.
*   **Contextual Recommendations:** The AI will learn to associate specific perfumes with certain contexts (e.g., 


a light, fresh scent for a workout; a warm, spicy scent for a winter evening).
*   **Perfume Wardrobe Management:** Allow users to manage their perfume collection within the app, track their usage, and receive insights on how to best utilize their fragrances.
*   **Community Features:** Enable users to share their experiences, rate perfumes, and see what others with similar profiles are enjoying.
*   **Educational Content:** Provide articles, videos, and tutorials on perfume science, fragrance families, and application techniques.

## 6. References

[1] Oriental-Style. (n.d.). *How Skin Type Affects Perfume Longevity & Scent*. Retrieved from https://www.oriental-style.de/en/blogs/wissenswertes/perfume-and-skin-type

[2] FragranceLord.com. (2025, February 25). *How Weather Affects Perfume Performance?* Retrieved from https://fragrancelord.com/blogs/news/how-weather-affects-perfume-performance

[3] Flutter. (n.d.). *AI*. Retrieved from https://flutter.dev/ai

