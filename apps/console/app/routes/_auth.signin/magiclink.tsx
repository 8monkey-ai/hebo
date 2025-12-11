import { Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@hebo/shared-ui/components/Button";
import { Label } from "@hebo/shared-ui/components/Label";
import { Input } from "@hebo/shared-ui/components/Input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hebo/shared-ui/components/InputOTP";

import { authService } from "~console/lib/auth"
import { setOtpEmail } from "~console/lib/auth/better-auth";

export function MagicLinkSignIn() {

  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [otp, setOtp] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const verifyOnce = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(globalThis.window?.location?.search ?? "");
    const emailParam = params.get("email") ?? undefined;
    const otpParam = params.get("otp") ?? undefined;

    if (emailParam) {
      setEmail(emailParam);
      setOtpEmail(emailParam);
    }
    if (otpParam) {
      setOtp(otpParam.toUpperCase());
      setLinkSent(true);
    }
  }, []);

  useEffect(() => {
    if (!linkSent || !otp || otp.length < 6 || verifyOnce.current) return;
    verifyOnce.current = true;
    setLoading(true);
    void authService
      .signInWithMagicLink(otp)
      .catch((err) => {
        if (err instanceof Error) setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [linkSent, otp]);

  return (
    !linkSent ? (
      <form 
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await authService.sendMagicLinkEmail(email!);
            setLinkSent(true);
          } catch (error) {
            error instanceof Error && setError(error.message);
          } finally {
            setLoading(false);
          }
        }}>

        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <Button type="submit" disabled={loading}>
          { loading? <Loader2Icon className="animate-spin" /> : "Send Email" }
        </Button>
        
        {error && <div className="text-destructive text-sm">{error}</div>}
      </form>

    ) : (

      <form       
        className="flex flex-col gap-2 items-center"   
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await authService.signInWithMagicLink(otp ?? "");
          } catch (error) {
            error instanceof Error && setError(error.message);
          } finally {
            setOtp(undefined);
            setLoading(false);
          }
        }}>
        <Label>Enter the code from your email</Label>
        <div className="flex gap-2">
          <InputOTP 
            maxLength={6}
            pattern={"^[a-zA-Z0-9]+$"}
            value={otp}
            onChange={(value) => setOtp(value.toUpperCase())}
            disabled={loading}
            >
            <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot className="bg-background" key={index} index={index} />
            ))}
            </InputOTPGroup>
          </InputOTP>
          <Button 
            type="submit"
            isLoading={loading}
            disabled={loading || (otp?.length !== 6)}>
            Verify
          </Button>
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <Button 
          type="button"
          variant='link'
          className='underline'
          onClick={() => {
            setError(undefined);
            setOtp(undefined);
            setLinkSent(false);
            verifyOnce.current = false;
            setOtpEmail(undefined);
          }}>
          Cancel
        </Button>
      </form>
    )
  )
}
