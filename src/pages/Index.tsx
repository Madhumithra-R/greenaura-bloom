import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PlantAssistant from "@/components/PlantAssistant";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <FeaturedProducts />
    <BrandStory />
    <WhyChooseUs />
    <Testimonials />
    <CallToAction />
    <ContactSection />
    <Footer />
    <PlantAssistant />
  </div>
);

export default Index;
