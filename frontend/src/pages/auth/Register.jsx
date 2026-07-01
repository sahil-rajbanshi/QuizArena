import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const floatUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: 2rem;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 460px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${floatUp} 0.5s ease both;
`;

const TopAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #7C3AED, #F59E0B);
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: 2rem;
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const FormTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  margin-bottom: 0.4rem;
`;

const FormSub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.6rem;
`;

const ErrorBanner = styled.div`
  background: ${({ theme }) => theme.colors.errorLight};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 1.2rem;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    &:hover { text-decoration: underline; }
  }
`;

const Register = () => {
  const { handleRegister, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    clearError();
    setLocalError(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    const { confirmPassword, ...payload } = form;
    // Backend expects: { name, email, password }
    handleRegister(payload);
  };

  const displayError = localError || error;

  return (
    <Page>
      <FormCard>
        <TopAccent />
        <FormHeader>
          <Emoji>🚀</Emoji>
          <FormTitle>Create your account</FormTitle>
          <FormSub>Start your quiz journey today — it's free</FormSub>
        </FormHeader>

        {displayError && <ErrorBanner>{displayError}</ErrorBanner>}

        <form onSubmit={onSubmit}>
          <Fields>
            <Input
              id="name"
              name="name"
              label="Full name"
              placeholder="John Doe"
              value={form.name}
              onChange={onChange}
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={onChange}
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </Fields>

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create account →"}
          </Button>
        </form>

        <FooterText>
          Already have an account? <Link to="/login">Sign in</Link>
        </FooterText>
      </FormCard>
    </Page>
  );
};

export default Register;