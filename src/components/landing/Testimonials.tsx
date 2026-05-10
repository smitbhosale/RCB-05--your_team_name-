"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Tilt3D } from "@/components/ui/Tilt3D";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "SDE Intern @ Google",
    content: "The Resume Analyzer is a cheat code. It caught errors I would have never noticed and helped me land my dream role.",
    image: "https://i.pravatar.cc/150?u=rahul",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    role: "Product Management Trainee",
    content: "CareerOS generated a project roadmap that taught me more than my college curriculum ever did. Truly futuristic.",
    image: "https://i.pravatar.cc/150?u=ananya",
    rating: 5,
  },
  {
    name: "Vikram Das",
    role: "Full Stack Dev @ Razorpay",
    content: "The AI mock interviews were brutal but effective. By the time I sat for the real one, I was completely calm.",
    image: "https://i.pravatar.cc/150?u=vikram",
    rating: 5,
  },
];

export const Testimonials = () => (
  <section id="testimonials" className="py-20 sm:py-24 relative overflow-hidden" aria-label="User testimonials">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-rcb-red font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter"
        >
          TRUSTED BY THE <span className="text-rcb-red">ELITE</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Tilt3D intensity={6}>
              <article className="glass-premium p-6 sm:p-8 rounded-3xl relative flex flex-col justify-between h-full hover:border-rcb-red/15 transition-all group">
                <Quote className="absolute top-5 right-6 sm:top-6 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 text-white/[0.03] group-hover:text-rcb-red/[0.06] transition-colors" aria-hidden="true" />

                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>

                <blockquote>
                  <p className="text-white/60 italic mb-6 sm:mb-8 relative z-10 leading-relaxed text-sm">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </blockquote>

                <footer className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={t.image}
                    alt={`Photo of ${t.name}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-rcb-red/20"
                    loading="lazy"
                  />
                  <div>
                    <cite className="font-bold text-white text-sm not-italic">{t.name}</cite>
                    <p className="text-[10px] sm:text-xs text-white/40">{t.role}</p>
                  </div>
                </footer>
              </article>
            </Tilt3D>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
