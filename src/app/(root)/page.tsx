"use client";

import { Button } from '@/components/ui/button'
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

const page = () => {
    const user = useUser();
    return (
        <div className='min-h-screen w-full flex items-center justify-center'>
            <UserButton />
            <Button asChild>
                {user.isSignedIn ? (
                    <SignOutButton />
                ) : (
                    <SignInButton mode='modal' />
                )}
            </Button>
        </div>
    )
}

export default page;