import React, { useState } from "react";

const CHAMPS = [
  { id: "company", label: "Nom de la société", type: "text", placeholder: "Ex : Ma Société SAS", icon: "🏢" },
  { id: "name", label: "Nom et prénom", type: "text", placeholder: "Ex : Jean Dupont", icon: "👤" },
  { id: "email", label: "Adresse email", type: "email", placeholder: "Ex : jean@masociete.fr", icon: "✉️" },
  { id: "phone", label: "Téléphone", type: "tel", placeholder: "Ex : 01 23 45 67 89", icon: "📞" },
];

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(21,42,74,0.15), 0 1px 3px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #152a4a 0%, #1e3a5f 100%)",
    padding: "36px 32px 28px",
    textAlign: "center",
    color: "#fff",
  },
  headerIcon: {
    fontSize: "42px",
    marginBottom: "12px",
    display: "block",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    fontFamily: "'Montserrat', sans-serif",
    margin: "0 0 8px",
    letterSpacing: "0.3px",
  },
  headerSub: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)",
    margin: 0,
    lineHeight: "1.5",
  },
  form: {
    padding: "28px 32px 32px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#152a4a",
    marginBottom: "6px",
    fontFamily: "'Montserrat', sans-serif",
  },
  required: {
    color: "#e51414",
    marginLeft: "2px",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 16px 12px 42px",
    fontSize: "14px",
    fontFamily: "'Open Sans', Arial, sans-serif",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#dce1e8",
    borderRadius: "10px",
    background: "#f8f9fb",
    color: "#152a4a",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#e51414",
    background: "#fef2f2",
  },
  inputFocus: {
    borderColor: "#152a4a",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(21,42,74,0.1)",
  },
  errorText: {
    fontSize: "12px",
    color: "#e51414",
    marginTop: "4px",
  },
  apiError: {
    padding: "12px 16px",
    background: "#fef2f2",
    border: "1px solid rgba(229,20,20,0.3)",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#e51414",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Montserrat', sans-serif",
    color: "#fff",
    background: "linear-gradient(135deg, #e51414 0%, #c91212 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 4px 14px rgba(229,20,20,0.35)",
    letterSpacing: "0.5px",
  },
  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  footer: {
    fontSize: "11px",
    color: "#8c95a4",
    textAlign: "center",
    marginTop: "16px",
    lineHeight: "1.4",
  },
};

export default function FormulaireAcces({ onAccess }) {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [focused, setFocused] = useState(null);

  function validate() {
    const e = {};
    if (!form.company.trim()) e.company = "Ce champ est obligatoire";
    if (!form.name.trim()) e.name = "Ce champ est obligatoire";
    if (!form.email.trim()) {
      e.email = "Ce champ est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Adresse email invalide";
    }
    if (!form.phone.trim()) e.phone = "Ce champ est obligatoire";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType: "simulator-access" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setApiError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      localStorage.setItem("ecs_simulator_access", "true");
      onAccess();
    } catch {
      setApiError("Impossible de contacter le serveur. Veuillez réessayer.");
      setLoading(false);
    }
  }

  function handleChange(id, value) {
    setForm((f) => ({ ...f, [id]: value }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: "" }));
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerIcon}>📊</span>
          <h2 style={styles.headerTitle}>Accédez à notre simulateur de tarifs</h2>
          <p style={styles.headerSub}>
            Renseignez vos coordonnées pour découvrir nos prix en temps réel.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {CHAMPS.map((c) => (
            <div key={c.id} style={styles.fieldGroup}>
              <label htmlFor={c.id} style={styles.label}>
                {c.label}<span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>{c.icon}</span>
                <input
                  id={c.id}
                  type={c.type}
                  placeholder={c.placeholder}
                  value={form[c.id]}
                  onChange={(e) => handleChange(c.id, e.target.value)}
                  onFocus={() => setFocused(c.id)}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...styles.input,
                    ...(errors[c.id] ? styles.inputError : {}),
                    ...(focused === c.id ? styles.inputFocus : {}),
                  }}
                />
              </div>
              {errors[c.id] && <div style={styles.errorText}>{errors[c.id]}</div>}
            </div>
          ))}

          {apiError && <div style={styles.apiError}>{apiError}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(229,20,20,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(229,20,20,0.35)";
            }}
          >
            {loading ? "Envoi en cours…" : "Accéder au simulateur"}
          </button>

          <p style={styles.footer}>
            Vos données sont utilisées uniquement pour vous recontacter.<br />
            Aucune utilisation commerciale abusive.
          </p>
        </form>
      </div>
    </div>
  );
}
