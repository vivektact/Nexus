import React from "react";
import { Link } from "react-router-dom";
import {
  MoveRight,
  Video,
  MessageCircleMore,
  Puzzle,
  UsersRound,
  BarChart,
  GraduationCap,
} from "lucide-react";

// Reusable component for feature cards
const FeatureCard = ({ icon, title, description, color }) => {
  const neonShadowStyle = {
    boxShadow: `0 0 20px ${color}30, 0 0 30px ${color}20`,
  };
  return (
    <div
      className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/30 hover:-translate-y-2"
      style={neonShadowStyle}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{
          backgroundColor: `${color}20`,
          border: `1px solid ${color}80`,
        }}
      >
        {React.cloneElement(icon, { color: color, size: 24 })}
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
};

// Reusable component for testimonial cards
const TestimonialCard = ({ quote, name, role, avatar }) => (
  <div className="bg-black/30 backdrop-blur-lg p-6 rounded-2xl border border-white/10 text-center">
    <p className="text-gray-300">"{quote}"</p>
    <div className="flex items-center justify-center mt-4">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full border-2 border-fuchsia-500"
      />
      <div className="ml-4 text-left">
        <h4 className="font-bold text-white">{name}</h4>
        <p className="text-sm text-cyan-400">{role}</p>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  const features = [
    {
      icon: <Video />,
      title: "HD Group Calls",
      description: "Connect with multiple friends in crystal-clear video rooms.",
      color: "#00ffff",
    },
    {
      icon: <MessageCircleMore />,
      title: "Real-time Chat",
      description:
        "Practice your writing skills with instant messaging during calls.",
      color: "#ff00ff",
    },
    {
      icon: <Puzzle />,
      title: "Interactive Quizzes",
      description:
        "Challenge friends with fun quizzes to master new vocabulary.",
      color: "#00ff00",
    },
    {
      icon: <UsersRound />,
      title: "Friend System",
      description: "Find and add language partners to build your network.",
      color: "#ffff00",
    },
    {
      icon: <BarChart />,
      title: "Progress Tracking",
      description: "Monitor your fluency and activity with personal dashboards.",
      color: "#ff8c00",
    },
    {
      icon: <GraduationCap />,
      title: "Guided Learning",
      description:
        "Follow structured paths to improve your English step-by-step.",
      color: "#8a2be2",
    },
  ];

  return (
    <div className="bg-[#0a0518] text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>

      <main className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              Connect. Learn. Glow.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Your universe for vibrant video calls, interactive learning, and
            making friends. Master English in a fun, dynamic environment.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard">
              <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-fuchsia-600 rounded-full transition-all duration-300 overflow-hidden hover:bg-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50">
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-cyan-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
                <span className="relative flex items-center gap-2">
                  Start a Meeting <Video size={20} />
                </span>
              </button>
            </Link>

            <Link to="/dashboard">
              <button className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-black bg-cyan-400 rounded-full transition-all duration-300 overflow-hidden hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50">
                <span className="absolute w-full h-full transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:scale-150 group-hover:opacity-0"></span>
                <span className="relative flex items-center gap-2">
                  Find a Partner <UsersRound size={20} />
                </span>
              </button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-400 mt-2">
              A complete toolkit for language mastery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mt-24 md:mt-32 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Get Started in Three Easy Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-white/20 -translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-cyan-500/20 border-2 border-cyan-500 rounded-full text-2xl font-bold text-cyan-300">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Create Profile
              </h3>
              <p className="mt-2 text-gray-400">
                Sign up and set up your learning goals.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-fuchsia-500/20 border-2 border-fuchsia-500 rounded-full text-2xl font-bold text-fuchsia-300">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Find Partners
              </h3>
              <p className="mt-2 text-gray-400">
                Browse and connect with learners worldwide.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-lime-500/20 border-2 border-lime-500 rounded-full text-2xl font-bold text-lime-300">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Start Learning
              </h3>
              <p className="mt-2 text-gray-400">
                Initiate calls, chat, and take quizzes together.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-24 md:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Loved by Learners Worldwide
            </h2>
            <p className="text-gray-400 mt-2">Don't just take our word for it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Nexus Meet transformed how I practice English. The quizzes are so much fun and I've made friends from three different countries!"
              name="Elena Rodriguez"
              role="Student from Spain"
              avatar="https://placehold.co/100x100/7e22ce/ffffff?text=E"
            />
            <TestimonialCard
              quote="The best platform for finding serious language partners. The video quality is excellent and the friend system makes it easy to stay in touch."
              name="Kenji Tanaka"
              role="Developer from Japan"
              avatar="https://placehold.co/100x100/0891b2/ffffff?text=K"
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mt-24 md:mt-32 text-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-cyan-500 rounded-full blur-2xl opacity-50"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-fuchsia-500 rounded-full blur-2xl opacity-50"></div>
          <h2 className="text-3xl font-bold text-white">
            Join a Community of 10,000+ Learners
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-300">
            Your journey to fluency starts now. Sign up for free and unlock your
            full potential.
          </p>

          <Link to="/dashboard">
            <button className="mt-8 group relative inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-black bg-cyan-400 rounded-full transition-all duration-300 overflow-hidden hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50">
              <span className="absolute w-full h-full transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:scale-150 group-hover:opacity-0"></span>
              <span className="relative flex items-center gap-2">
                Sign Up For Free <MoveRight size={20} />
              </span>
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
