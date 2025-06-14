import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {useGetCategoriesQuery} from "@/lib/redux/services/api";
import LoadingRestaurant from "@/app/(main)/restaurants/LoadingRestaurant";

const FeatureCategories = () => {
    const getCategories= useGetCategoriesQuery();
    if(getCategories?.isLoading){
        return <LoadingRestaurant/>
    }
    return <section className="container px-4 md:px-6 py-8">
        <h2 className="text-xl lg:text-3xl font-bold tracking-tight mb-6">Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {getCategories?.currentData?.contents?.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                    <Link href={`/menu?category=${category.name.toLowerCase()}`}>
                        <div className="relative h-24 sm:h-32 ">
                            <Image src={`${category.url}?height=150&width=150`} alt={category.name+category.id} fill
                                   className="object-contain"/>

                        </div>
                        <CardContent className="p-2 text-center">
                            <h3 className="font-medium">{category.name}</h3>
                        </CardContent>
                    </Link>
                </Card>))}
        </div>
    </section>
};

export default FeatureCategories;
