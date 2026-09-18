"use client";
import { useEffect } from "react";
import { gsap } from "gsap";

let ScrollTriggerLoaded = false;

const GSAPProvider = () => {
  useEffect(() => {
    if (ScrollTriggerLoaded) return;

    const initGSAP = async () => {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");

        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        ScrollTriggerLoaded = true;

        // Animate all elements with data-gsap="fade-up" attribute
        const fadeUpEls = document.querySelectorAll("[data-gsap='fade-up']");
        fadeUpEls.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                end: "bottom 20%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Animate all elements with data-gsap="fade-left"
        const fadeLeftEls = document.querySelectorAll("[data-gsap='fade-left']");
        fadeLeftEls.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, x: -60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Animate stat counters with data-gsap="counter"
        const counters = document.querySelectorAll("[data-gsap='counter']");
        counters.forEach((el) => {
          const target = parseFloat(el.getAttribute("data-target") || "0");
          const isDecimal = el.getAttribute("data-decimal") === "true";
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent = isDecimal
                  ? this.targets()[0].val.toFixed(1)
                  : Math.round(this.targets()[0].val).toString();
              },
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Horizontal marquee scroll for feature sections
        const marquees = document.querySelectorAll("[data-gsap='marquee']");
        marquees.forEach((el) => {
          const inner = el.querySelector("[data-gsap='marquee-inner']");
          if (!inner) return;
          gsap.to(inner, {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1,
          });
        });

        // Stagger card animations
        const staggerGroups = document.querySelectorAll("[data-gsap='stagger-parent']");
        staggerGroups.forEach((group) => {
          const children = group.querySelectorAll("[data-gsap='stagger-child']");
          gsap.fromTo(
            children,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: group,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Parallax background effect
        const parallaxEls = document.querySelectorAll("[data-gsap='parallax']");
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-speed") || "0.3");
          gsap.to(el, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // Glowing border pulse on section titles
        const sectionTitles = document.querySelectorAll(".section-title");
        sectionTitles.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Refresh ScrollTrigger after all are set
        ScrollTrigger.refresh();
      } catch (e) {
        // GSAP plugins not available, silently continue
        console.debug("GSAP ScrollTrigger init skipped:", e);
      }
    };

    // Run after a short delay to let DOM render first
    const timer = setTimeout(initGSAP, 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default GSAPProvider;
