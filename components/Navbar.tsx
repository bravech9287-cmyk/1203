import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CategoryMenu } from "@/components/category-menu";
import { CartIcon } from "@/components/cart-icon";
import { Package } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        SaaS Template
      </Link>
      <div className="flex gap-4 items-center">
        <CategoryMenu />
        <SignedIn>
          <Link href="/orders">
            <Button variant="ghost" size="icon" title="주문 내역">
              <Package className="h-5 w-5" />
            </Button>
          </Link>
          <CartIcon />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
