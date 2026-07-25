"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="section-number">SIGN IN</span>
        <h1>ENTRAR</h1>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">CONTRASEÑA</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "ENTRANDO..." : "ENTRAR ↗"}
          </button>
        </form>
        <p className="auth-switch">
          ¿No tenés cuenta? <Link href="/register">Registrate acá</Link>
        </p>
      </div>
    </main>
  );
}
