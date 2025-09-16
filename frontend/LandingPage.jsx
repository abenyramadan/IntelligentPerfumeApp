import { Button } from "@/components/ui/button";
import { Sparkles, UserPlus, LogIn, Star, Droplets, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
	{
		icon: <Sparkles className="h-7 w-7 text-purple-600" />,
		title: "AI-Powered Recommendations",
		description:
			"Discover perfumes tailored to your unique skin chemistry, preferences, and lifestyle using advanced AI.",
	},
	{
		icon: <Droplets className="h-7 w-7 text-blue-500" />,
		title: "Personalized Profile",
		description:
			"Build your scent profile and let ScentAI learn your likes, dislikes, and fragrance history.",
	},
	{
		icon: <Star className="h-7 w-7 text-yellow-500" />,
		title: "Track Your Favorites",
		description:
			"Save, rate, and revisit your favorite scents and recommendations anytime.",
	},
	{
		icon: <Heart className="h-7 w-7 text-pink-500" />,
		title: "Community Insights",
		description:
			"See trending fragrances and reviews from fellow scent enthusiasts.",
	},
];

const testimonials = [
	{
		name: "Amina O.",
		text: "ScentAI helped me discover perfumes I never would have tried. The recommendations are spot on!",
		avatar: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "James K.",
		text: "I love how easy it is to track my favorites and get daily suggestions. Highly recommended!",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Lila S.",
		text: "The AI really understands my preferences. My friends always ask what I'm wearing now!",
		avatar: "https://randomuser.me/api/portraits/women/68.jpg",
	},
];

const faqs = [
	{
		q: "Is ScentAI free to use?",
		a: "Yes! You can create an account and get personalized recommendations for free.",
	},
	{
		q: "How does the AI work?",
		a: "Our AI analyzes your profile, preferences, and feedback to suggest fragrances you'll love.",
	},
	{
		q: "Can I track perfumes I already own?",
		a: "Absolutely! Add, rate, and review any scent in your collection.",
	},
];

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-pink-200 flex flex-col">
			{/* Hero Section */}
			<section className="relative flex-1 flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
				{/* Animated Gradient Blobs */}
				<div className="absolute inset-0 pointer-events-none z-0">
					<div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
					<div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
					<div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-tr from-pink-300 via-purple-200 to-purple-400 rounded-full opacity-20 blur-2xl animate-spin-slow"></div>
				</div>
				<div className="max-w-2xl text-center relative z-10">
					{/* Animated Logo */}
					<div className="flex justify-center mb-6">
						<div className="rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-yellow-300 p-2 shadow-lg animate-glow">
							{/* Perfume bottle SVG illustration */}
							<svg width="60" height="60" viewBox="0 0 60 60" fill="none">
								<ellipse cx="30" cy="40" rx="18" ry="16" fill="#fff" className="opacity-90" />
								<ellipse cx="30" cy="40" rx="14" ry="12" fill="#f3e8ff" />
								<rect x="25" y="12" width="10" height="16" rx="5" fill="#a78bfa" />
								<rect x="27" y="8" width="6" height="6" rx="3" fill="#f472b6" />
								<rect x="28" y="4" width="4" height="4" rx="2" fill="#fbbf24" />
							</svg>
						</div>
					</div>
					{/* Animated Headline */}
					<h1 className="text-5xl sm:text-6xl font-extrabold text-purple-700 mb-4 drop-shadow animate-fade-in-up">
						<span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x">
							Welcome to ScentAI Find Your Signature Scent
						</span>
					</h1>
					<p className="text-xl text-gray-700 mb-8 animate-fade-in-slow">
						AI-powered fragrance recommendations, personalized for you.<br />
						Join a vibrant community and elevate your daily ritual.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-slow">
						<Button
							size="lg"
							onClick={() => navigate("/register")}
							className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg animate-bounce"
						>
							<UserPlus className="mr-2 h-5 w-5" />
							Get Started Free
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={() => navigate("/login")}
							className="border-purple-500 text-purple-700"
						>
							<LogIn className="mr-2 h-5 w-5" />
							Sign In
						</Button>
					</div>
					<div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-2 animate-fade-in-slow">
						<Users className="h-5 w-5 text-purple-400" />
						Join <span className="font-semibold text-purple-700">5,000+</span> scent lovers!
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-white py-14 shadow-inner">
				<div className="max-w-5xl mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-purple-700 mb-10">
						What to Expect
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{features.map((feature, idx) => (
							<div
								key={idx}
								className="flex items-start space-x-4 bg-purple-50 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-200"
							>
								<div>{feature.icon}</div>
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{feature.title}
									</h3>
									<p className="text-gray-600">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>


			{/* FAQs */}
			<section className="py-14">
				<div className="max-w-5xl mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-purple-700 mb-10">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{faqs.map((faq, idx) => (
							<div
								key={idx}
								className="bg-purple-50 rounded-xl p-6 shadow-md"
							>
								<h3 className="text-xl font-semibold text-purple-700 mb-2">
									{faq.q}
								</h3>
								<p className="text-gray-700">{faq.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-12 text-center bg-gradient-to-r from-purple-600 to-pink-500">
				<h2 className="text-2xl font-bold text-white mb-4">
					Ready to find your signature scent?
				</h2>
				<p className="text-white mb-6">
					Sign up for free and let ScentAI guide you to fragrances you'll love.
				</p>
				<Button
					size="lg"
					onClick={() => navigate("/register")}
					className="bg-white text-purple-700 hover:bg-gray-100"
				>
					<Sparkles className="mr-2 h-5 w-5" />
					Get Started Now
				</Button>
			</section>
		</div>
	);
};

export default LandingPage;
