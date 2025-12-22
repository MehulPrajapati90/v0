"use server";

import client from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return {
                success: false,
                error: "No authenticated user found",
            };
        }

        const { id, firstName, lastName, imageUrl, emailAddresses } = user;

        const newUser = await client.user.upsert({
            where: {
                clerkId: id,
            },
            update: {
                name:
                    firstName && lastName
                        ? `${firstName} ${lastName}`
                        : firstName || lastName || null,
                image: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
            },
            create: {
                clerkId: id,
                name:
                    firstName && lastName
                        ? `${firstName} ${lastName}`
                        : firstName || lastName || null,
                image: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
            },
        });

        return {
            success: true,
            user: newUser,
            message: "User onboarded successfully",
        };
    } catch (error) {
        console.error("❌ Error onboarding user:", error);
        return {
            success: false,
            error: "Failed to onboard user",
        };
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return null;
        }

        const clientUser = await client.user.findUnique({
            where: {
                clerkId: user.id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                clerkId: true,
            },
        });

        return clientUser;
    } catch (error) {
        console.error("❌ Error fetching current user:", error);
        return null;
    }
};