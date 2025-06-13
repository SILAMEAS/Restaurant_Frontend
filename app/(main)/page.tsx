"use client"
import HeroSection from "@/app/(main)/components/HeroSection";
import FeatureRestaurant from "@/app/(main)/components/FeatureRestaurant";
import FeatureCategories from "@/app/(main)/components/FeatureCategories";

export default function Home() {


    return (<div className="container ">
        {/* Hero Section */}
        <HeroSection />
        {/* Featured Restaurants */}
        <FeatureRestaurant/>
        {/* Featured Categories */}
        <FeatureCategories/>
    </div>)
}
