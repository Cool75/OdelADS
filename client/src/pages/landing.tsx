import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Play, DollarSign, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SiGoogle, SiFacebook } from "react-icons/si";

type ViewType = "landing" | "login" | "register";

export default function LandingPage() {
  const [view, setView] = useState<ViewType>("landing");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAuth = () => {
    window.location.href = "/api/login";
  };

  // Landing/Welcome View
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Image with Gradient */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white text-4xl md:text-5xl font-bold">O</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white text-center mb-4"
              data-testid="text-main-title"
            >
              ODEL<span className="text-orange-500">ADS</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-300 text-center mb-12 max-w-md"
            >
              Watch ads. Earn money. It's that simple.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 md:gap-8 mb-12 w-full max-w-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs md:text-sm text-gray-400">Watch Ads</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs md:text-sm text-gray-400">Earn Money</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs md:text-sm text-gray-400">Withdraw</span>
              </div>
            </motion.div>

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full max-w-sm space-y-4 px-4"
            >
              <Button
                onClick={() => setView("login")}
                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-xl"
                data-testid="button-go-login"
              >
                Log In
              </Button>
              <Button
                onClick={() => setView("register")}
                variant="outline"
                className="w-full h-14 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold text-lg rounded-xl bg-transparent"
                data-testid="button-go-register"
              >
                Create Account
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-8 mt-12 text-center"
            >
              <div>
                <p className="text-2xl md:text-3xl font-bold text-orange-500">10K+</p>
                <p className="text-xs text-gray-500">Active Users</p>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <p className="text-2xl md:text-3xl font-bold text-orange-500">LKR 5M+</p>
                <p className="text-xs text-gray-500">Paid Out</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-red-600/90 z-10" />
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop"
            alt="VR Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start p-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <span className="text-white text-3xl font-bold">O</span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-8 right-8 z-20"
          >
            <h2 className="text-white text-2xl font-bold mb-2">Welcome to ODEL ADS</h2>
            <p className="text-white/80 text-sm">Watch ads. Earn rewards. It's that simple.</p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Back Button */}
            <button
              onClick={() => setView("landing")}
              className="mb-6 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
              data-testid="button-back-landing"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>

            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">O</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="text-auth-title">
              {view === "login" ? "Log in" : "Create an Account"}
            </h1>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
              {view === "login" ? (
                <>Don't have an account? <button onClick={() => setView("register")} className="text-orange-500 font-medium">Create an Account</button></>
              ) : (
                <>Already have an account? <button onClick={() => setView("login")} className="text-orange-500 font-medium">Log in</button></>
              )}
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {view === "register" && (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                    <Input
                      placeholder="John"
                      className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                    <Input
                      placeholder="Doe"
                      className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  className="h-11 md:h-12 border-gray-300 focus:border-orange-500"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-11 md:h-12 border-gray-300 focus:border-orange-500 pr-12"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {view === "login" && (
                  <div className="text-right mt-2">
                    <button className="text-sm text-orange-500 font-medium">Forgot Password?</button>
                  </div>
                )}
              </div>

              {/* Terms Checkbox - only for register */}
              {view === "register" && (
                <div className="flex items-start gap-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="border-gray-300 mt-0.5"
                    data-testid="checkbox-terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <button className="text-orange-500 font-medium">Terms & Conditions</button>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleAuth}
                className="w-full h-12 md:h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base md:text-lg rounded-xl mt-4"
                data-testid="button-submit-auth"
              >
                {view === "login" ? "Log In" : "Create Account"}
              </Button>

              {/* Divider */}
              <div className="relative my-4 md:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">or continue with</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-11 md:h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-xl text-sm"
                  data-testid="button-google"
                >
                  <SiGoogle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-red-500" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-11 md:h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-xl text-sm"
                  data-testid="button-facebook"
                >
                  <SiFacebook className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                  Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
