import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import LoginButton from '../auth/LoginButton';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Package } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/marketplace-logo.dim_512x128.png"
            alt="Meyouu"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">Browse</Link>
          </Button>
          {isAuthenticated && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/my-listings" className="gap-2">
                  <Package className="h-4 w-4" />
                  My Listings
                </Link>
              </Button>
              <Button asChild>
                <Link to="/create" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Listing
                </Link>
              </Button>
            </>
          )}
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
