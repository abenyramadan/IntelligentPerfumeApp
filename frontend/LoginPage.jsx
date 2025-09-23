import { useState } from "react";
import ApiService from "./services/api.js";
import { Button } from "./src/components/ui/button";
import { Input } from "./src/components/ui/input";
import { Label } from "./src/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./src/components/ui/card";
import { toast } from "sonner";

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ApiService.login({
        username: formData.username,
        password: formData.password,
      });

      // check if login was successful
      if (response?.success) {
        // The response contains a token object, need to get user info separately
        const tokenData = response.data[0];

        // Get user details using the token's user_id
        const userResponse = await ApiService.getUserById(tokenData.user_id);

        const userObj = {
          id: tokenData.user_id,  // ✅ Use the correct field name
          user_id: tokenData.user_id,  // ✅ Include both for compatibility
          token: tokenData.token,
          token_type: tokenData.type,
          username: userResponse?.data?.[0]?.username || formData.username,
          email: userResponse?.data?.[0]?.email || '',
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        onLogin(userObj);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed. please try again");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-2xl text-white">🌸</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your ScentAI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
