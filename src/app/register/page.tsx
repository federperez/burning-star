"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear la cuenta.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Cuenta creada, pero no se pudo iniciar sesión. Probá entrar manualmente.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="section-number">JOIN THE SIGNAL</span>
        <h1>CREAR CUENTA</h1>
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
            <label htmlFor="password">CONTRASEÑA (MÍN. 8 CARACTERES)</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "CREANDO..." : "CREAR CUENTA ↗"}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link href="/login">Entrá acá</Link>
        </p>
      </div>
    </main>
  );
}
