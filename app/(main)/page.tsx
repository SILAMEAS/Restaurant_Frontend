"use client"
import HeroSection from "@/components/home/HeroSection";
import FeatureRestaurant from "@/components/home/FeatureRestaurant";
import FeatureCategories from "@/components/home/FeatureCategories";

export default function Home() {

    return (<div className="container ">
        {/* Hero Section */}
        <HeroSection/>
        {/* Featured Restaurants */}
        <FeatureRestaurant/>
        {/* Featured Categories */}
        <FeatureCategories/>
    </div>)
}
