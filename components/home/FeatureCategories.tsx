import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const FeatureCategories = () => {
    return <section className="container px-4 md:px-6 py-8 bg-muted">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Pizza", "Burgers", "Sushi", "Salads", "Desserts", "Drinks"].map((category) => (
                <Card key={category} className="overflow-hidden">
                    <Link href={`/menu?category=${category.toLowerCase()}`}>
                        <div className="relative h-24 sm:h-32">
                            <Image src={`/placeholder.svg?height=150&width=150`} alt={category} fill
                                   className="object-cover"/>
                        </div>
                        <CardContent className="p-2 text-center">
                            <h3 className="font-medium">{category}</h3>
                        </CardContent>
                    </Link>
                </Card>))}
        </div>
    </section>
};

export default FeatureCategories;
