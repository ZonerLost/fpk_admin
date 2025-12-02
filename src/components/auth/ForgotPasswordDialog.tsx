import React from "react";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";
import { cn } from "../../shared/utils/cn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setIsSending(false);
      setSent(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSending(true);
      // TODO: call real API endpoint for password reset
      console.log("Send reset link to", email);
      await new Promise((res) => setTimeout(res, 800));
      setSent(true);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-6">
      <div
        className={cn(
          "w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/40",
          "bg-[#031610] p-5 shadow-[0_0_50px_rgba(0,0,0,0.7)]"
        )}
      >
        <h3 className="text-lg font-bold text-slate-50">
          Reset password
        </h3>
        <p className="mt-1 text-xs text-slate-300 md:text-sm">
          Enter the email address linked to your admin account and we'll
          send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <TextField
            label="Email"
            type="email"
            placeholder="admin@zonerlost.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {sent && (
            <p className="text-xs text-emerald-300 md:text-sm">
              If an account exists for this email, a reset link has been
              sent.
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full border border-white/20 bg-transparent px-4 py-1.5 text-xs md:text-sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSending || !email}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 md:text-sm"
            >
              {isSending ? "Sending..." : "Send reset link"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;
