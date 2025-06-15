'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {FormProvider, useForm  } from '@/contexts/FormContext';

function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false);
 const { user, isLoading } = useForm();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="relative border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="https://res.cloudinary.com/dsncwuizo/image/upload/v1749592777/Logo_insuriana_h2031u.svg" 
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Menu (empty for now, but using your component) */}
            <NavigationMenu>
              {/* Empty for now as requested */}
            </NavigationMenu>

            {/* Right side placeholder for future auth dropdown */}
            <div className="flex-shrink-0 ">
             {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {!user.emailVerified && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Email not verified
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

            </div>
          </div>
        </div>

        {/* Lady's circular image in center - positioned absolutely */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`relative transition-all duration-300 ease-in-out ${
              isScrolled 
                ? 'w-12 h-12' 
                : 'w-16 h-16'
            }`}
          >
            <Image
              src="https://res.cloudinary.com/dsncwuizo/image/upload/v1749657986/chat-assistant_hutpxm.png" 
              alt="Zoe"
              fill
              className="rounded-full object-cover border-2 border-background shadow-lg"
            />
          </div>
        </div>

        {/* Border line that goes through the center image */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      </nav>
    </div>
  );
}

export function Navbar() {
  return (
    <FormProvider steps={[]}>
      <NavbarContent />
    </FormProvider>
  );
}