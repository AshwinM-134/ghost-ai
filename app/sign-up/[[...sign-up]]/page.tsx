import { SignUp } from "@clerk/nextjs";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-base flex">
      <AuthLeftPanel />
      <div className="flex flex-1 lg:w-1/2 items-center justify-center px-6">
        <SignUp />
      </div>
    </div>
  );
}
