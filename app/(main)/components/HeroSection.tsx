import React from 'react';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import {useGetRestaurantOwnerQuery} from "@/lib/redux/services/api";
import {cn} from "@/lib/utils";

const HeroSection = () => {
    return   <section className="container py-12 md:py-24 lg:py-32 flex-col items-center justify-center">
        <div className=" px-4 md:px-6 ">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                            Delicious Food Delivered to Your Door
                        </h1>
                        <p className="max-w-[600px] text-sm text-muted-foreground md:text-xl">
                            Order from your favorite restaurants and enjoy a seamless delivery experience.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Link href="/menu">
                            <Button
                                className={cn(
                                    "text-xs px-2 py-1",     // md style
                                    "lg:text-base lg:px-6 lg:py-3" // lg style
                                )}
                            >
                                Browse Menu
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        
                    </div>
                </div>
                <div className="mx-auto lg:ml-auto">
                    <Image
                        alt="Hero Image"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                        height={550}
                        width={550}
                        src={'/images/home_res.webp'}
                    />
                </div>
            </div>
        </div>
    </section>
};

export default HeroSection;
