import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { SiGoogle, SiFacebook } from "react-icons/si";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAuth = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Image */}
        <div className="md:w-1/2 relative">
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
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Back Button */}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mb-6 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-toggle-auth"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-auth-title">
              {isLogin ? "Log in" : "Create an Account"}
            </h1>
            <p className="text-gray-500 mb-8">
              {isLogin ? (
                <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-gray-900 underline font-medium">Create an Account</button></>
              ) : (
                <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-gray-900 underline font-medium">Log in</button></>
              )}
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">First Name</label>
                    <Input
                      placeholder="John"
                      className="h-12 border-gray-300 focus:border-gray-900"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                    <Input
                      placeholder="Last Name"
                      className="h-12 border-gray-300 focus:border-gray-900"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="h-12 border-gray-300 focus:border-gray-900"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-12 border-gray-300 focus:border-gray-900 pr-12"
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
                {isLogin && (
                  <div className="text-right mt-2">
                    <button className="text-sm text-gray-900 underline">Forgot Password?</button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleAuth}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full mt-4"
                data-testid="button-submit-auth"
              >
                {isLogin ? "Log in" : "Create Account"}
              </Button>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="border-gray-300"
                  data-testid="checkbox-terms"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <button className="underline font-medium text-gray-900">Terms & Condition</button>
                </label>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">or</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-full"
                  data-testid="button-google"
                >
                  <SiGoogle className="w-5 h-5 mr-2 text-red-500" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-full"
                  data-testid="button-facebook"
                >
                  <SiFacebook className="w-5 h-5 mr-2 text-blue-600" />
                  Continue with Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
