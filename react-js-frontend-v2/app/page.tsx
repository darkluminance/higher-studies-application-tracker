"use client";

import Link from "next/link";
import {
  GraduationCap,
  Target,
  Users,
  Calendar,
  FileText,
  Mail,
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-semibold tracking-tight">
                Track<span className="text-gradient-gold">Grad</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="group">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 paper-texture" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        {/* Floating elements */}
        <div className="absolute top-40 right-20 animate-float opacity-20">
          <GraduationCap className="w-16 h-16 text-primary" />
        </div>
        <div
          className="absolute bottom-40 left-20 animate-float opacity-20"
          style={{ animationDelay: "2s" }}
        >
          <BookOpen className="w-12 h-12 text-gold" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8 animate-fade-up opacity-0">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">
                Your Graduate Journey Starts Here
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-tight mb-6 animate-fade-up opacity-0 stagger-1">
              Track Your Path to
              <br />
              <span className="text-gradient-gold">Academic Excellence</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up opacity-0 stagger-2">
              The elegant companion for ambitious graduate school applicants.
              Organize universities, track deadlines, manage recommendations,
              and navigate your journey to your dream program.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up opacity-0 stagger-3">
              <Button size="lg" className="text-base px-8 animate-pulse-glow" asChild>
                <Link href="/register">
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Powerful Features
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Everything You Need to
              <br />
              <span className="text-gradient-gold">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive toolkit designed specifically for graduate school
              applicants. Stay organized, never miss a deadline, and track every
              aspect of your applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "University Tracker",
                description:
                  "Manage your target universities with detailed information including rankings, deadlines, requirements, and application fees.",
                color: "gold",
              },
              {
                icon: Users,
                title: "Faculty Management",
                description:
                  "Keep track of faculty members, their research areas, publications, and your correspondence history.",
                color: "primary",
              },
              {
                icon: Mail,
                title: "Email Correspondence",
                description:
                  "Log and track all your email communications with faculty. Record response vibes and interview requests.",
                color: "success",
              },
              {
                icon: Calendar,
                title: "Interview Scheduler",
                description:
                  "Never miss an interview. Schedule, prepare, and track your interview outcomes with faculty members.",
                color: "warning",
              },
              {
                icon: FileText,
                title: "LOR Tracking",
                description:
                  "Monitor recommendation letter requests and submissions. Know exactly which recommenders have submitted.",
                color: "chart-4",
              },
              {
                icon: TrendingUp,
                title: "Application Status",
                description:
                  "Track each application's progress from draft to submission to decision. Visual timeline for quick overview.",
                color: "chart-5",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544v-2.26zM0 5.373l25.456 25.455-1.414 1.414L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V.283zM60 5.373L34.544 30.828l1.414 1.414L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Simple Process</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Get Started in
              <br />
              <span className="text-gold">Three Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description:
                  "Sign up in seconds and set up your profile. Add your target degree, research interests, and timeline.",
              },
              {
                step: "02",
                title: "Add Your Targets",
                description:
                  "Import or manually add universities, faculty members, and recommenders. Set deadlines and requirements.",
              },
              {
                step: "03",
                title: "Track & Succeed",
                description:
                  "Monitor your progress with our intuitive dashboard. Get reminders, track responses, and stay organized.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-serif font-bold text-white/5 absolute -top-8 -left-4">
                  {item.step}
                </div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-gold-foreground font-semibold mb-6">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              Free to Get Started
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-6xl font-semibold mb-6">
            Ready to Begin Your
            <br />
            <span className="text-gradient-gold">Graduate Journey?</span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Join thousands of successful applicants who trusted TrackGrad to
            organize their path to academic excellence. Start tracking today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-10 py-6 animate-pulse-glow" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-gold-foreground" />
                </div>
                <span className="text-xl font-semibold">TrackGrad</span>
              </Link>
              <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
                Your trusted companion for graduate school applications.
                Organize, track, and succeed in your academic journey.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="#features" className="hover:text-primary-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-primary-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>
                  <Link href="/login" className="hover:text-primary-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary-foreground transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              &copy; {new Date().getFullYear()} TrackGrad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
