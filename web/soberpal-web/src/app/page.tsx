'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Brain } from 'lucide-react';

export default function Home() {
  const [soberDays, setSoberDays] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'elite'>('free');
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load user data from localStorage or API
    const savedDays = localStorage.getItem('soberDays');
    const savedTier = localStorage.getItem('subscriptionTier');
    
    if (savedDays) setSoberDays(parseInt(savedDays));
    if (savedTier) setSubscriptionTier(savedTier as 'free' | 'premium' | 'elite');
  }, []);

  const handleDayComplete = () => {
    const newDays = soberDays + 1;
    setSoberDays(newDays);
    localStorage.setItem('soberDays', newDays.toString());
  };

  const triggerPaywall = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };

  const handleUpgrade = (tier: 'premium' | 'elite') => {
    setSubscriptionTier(tier);
    localStorage.setItem('subscriptionTier', tier);
    setShowPaywall(false);
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Every day is a new beginning. Take a deep breath and start again.",
      "You are stronger than you think and braver than you feel.",
      "Recovery is not a destination, it's a journey of self-discovery.",
      "One day at a time, one step at a time, one breath at a time.",
      "Your journey matters. Your story matters. You matter."
    ];

    if (soberDays === 0) return "Today is the first day of the rest of your life.";
    if (soberDays === 1) return "You did it! The first day is often the hardest.";
    if (soberDays === 7) return "One week strong! You're building incredible momentum.";
    if (soberDays === 30) return "30 days! You've proven to yourself that you can do this.";

    return quotes[soberDays % quotes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌟</div>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">SoberPal</h1>
                <p className="text-slate-300 text-sm">Your Journey to Freedom</p>
              </div>
            </div>
            {subscriptionTier !== 'free' && (
              <div className="bg-emerald-600 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-semibold">
                  {subscriptionTier === 'premium' ? '⭐ PREMIUM' : '👑 ELITE'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Tracker */}
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Your Progress</h3>
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald-400 mb-2">{soberDays}</div>
                <div className="text-slate-300 mb-4">
                  {soberDays === 1 ? 'Day Sober' : 'Days Sober'}
                </div>
                <button
                  onClick={handleDayComplete}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Mark Day Complete
                </button>
              </div>
            </motion.div>
            
            {/* Current Time */}
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Current Time</h3>
              <div className="text-center">
                <div className="text-2xl font-mono text-amber-400">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-slate-400 mt-2">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div 
              className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">💪</div>
                <blockquote className="text-slate-200 italic text-lg leading-relaxed">
                  "{getMotivationalQuote()}"
                </blockquote>
                <cite className="text-emerald-400 text-sm mt-4 block">- SoberPal Community</cite>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Sage AI Chat */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">🌟</div>
                <div>
                  <h2 className="text-xl font-bold text-amber-400">Chat with Sage</h2>
                  <p className="text-slate-400 text-sm">Your AI Recovery Companion</p>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4 min-h-[400px] flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-200">
                      Hey there! I'm Sage, your recovery companion. I'm here 24/7 to support you on your journey. 
                      How are you feeling today?
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => triggerPaywall('Advanced Analysis')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Get Advanced Analysis
                  </button>
                  <button 
                    onClick={() => triggerPaywall('Crisis Support')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Crisis Support
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "24/7 Support", desc: "Always here when you need us" },
            { icon: Shield, title: "Crisis Intervention", desc: "Immediate help in tough moments" },
            { icon: Users, title: "Community", desc: "Connect with others on the journey" },
            { icon: Brain, title: "AI Insights", desc: "Personalized recovery strategies" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <feature.icon className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Simple Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-amber-400 mb-4">Unlock {paywallFeature}</h3>
              <p className="text-slate-300 mb-6">
                Get access to Sage's premium features and advanced recovery support.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Upgrade to Premium - $19.99/month
                </button>
                <button
                  onClick={() => handleUpgrade('elite')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Upgrade to Elite - $39.99/month
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full text-slate-400 hover:text-slate-300 py-2 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
