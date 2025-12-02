import React from "react";
import LoginFormCard from "../../components/auth/LoginFormCard";
import ForgotPasswordDialog from "../../components/auth/ForgotPasswordDialog";

const LoginPage: React.FC = () => {
  const [isForgotOpen, setIsForgotOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#032716] text-slate-50">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#0f3f26_0,_#02140b_55%,_#010807_100%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
        <div className="flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-stretch">

          {/* Login card */}
          <div className="mx-auto w-full lg:w-1/2">
            <div className="mx-auto w-full max-w-md">
              <LoginFormCard
                onForgotPassword={() => setIsForgotOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordDialog
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
