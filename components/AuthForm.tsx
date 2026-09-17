"use client";

import { useActionState } from "react";
import { signInAction, signUpAction, type AuthFormState } from "@/lib/auth/actions";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
};

export default function AuthForm({ mode, nextPath = "/" }: AuthFormProps) {
  const action = mode === "sign-up" ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(action, null);
  const isSignUp = mode === "sign-up";

  return (
    <form className="auth-form" action={formAction} noValidate>
      <input type="hidden" name="next" value={nextPath} />
      {isSignUp ? (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
          minLength={8}
          maxLength={72}
        />
      </div>
      {state?.error ? (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "A moment…" : isSignUp ? "Begin looking" : "Sign in"}
        <span className="arrow" aria-hidden="true" />
      </button>
    </form>
  );
}
