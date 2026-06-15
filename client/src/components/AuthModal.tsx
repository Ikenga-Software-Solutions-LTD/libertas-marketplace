import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");

  const handleAlphaLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an email signup flow
    console.log("Email signup for:", email);
    alert("Signup link sent to " + email);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-primary via-primary to-accent p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-display font-bold text-white mb-2">Join Libertas Market</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 text-base leading-relaxed">
              Create a market account for faster settlements and a personalized shopping experience.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 bg-card">
          {/* Alpha ID Option */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fastest Way</h3>
            <Button 
              onClick={handleAlphaLogin} 
              className="w-full h-14 bg-white text-black hover:bg-neutral-100 border-2 border-neutral-200 shadow-sm flex items-center justify-between px-6 transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg italic">Alpha ID Login</span>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Login securely using your LibertasAlpha.com account
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Signup Option */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-primary/50"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 font-bold text-lg shadow-lg hover:shadow-primary/20">
              Create Account
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
