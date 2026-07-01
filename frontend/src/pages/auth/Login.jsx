import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// ── Animations ──────────────────────────────────────────────
const floatUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.08); }
`;

// ── Layout ───────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${({ theme }) => theme.colors.bg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Left panel — decorative
const LeftPanel = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const OrbOne = styled.div`
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: radial-gradient(circle, #7C3AED44, transparent 70%);
  top: -80px;
  left: -80px;
  animation: ${pulse} 5s ease infinite;
`;

const OrbTwo = styled.div`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, #F59E0B33, transparent 70%);
  bottom: -60px;
  right: -60px;
  animation: ${pulse} 7s ease infinite reverse;
`;

const BrandMark = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const BigEmoji = styled.div`
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 24px #7C3AED88);
`;

const BrandTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  background: linear-gradient(135deg, #7C3AED, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
`;

const BrandSub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  max-width: 280px;
  line-height: 1.6;
`;

const StatRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNum = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// Right panel — form
const RightPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  animation: ${floatUp} 0.5s ease both;
`;

const FormHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const FormTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  margin-bottom: 0.5rem;
`;

const FormSub = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.8rem;
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

// ── Component ────────────────────────────────────────────────
const Login = () => {
  const { handleLogin, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(form);
  };

  return (
    <Page>
      {/* ── Left decorative panel ── */}
      <LeftPanel>
        <OrbOne />
        <OrbTwo />
        <BrandMark>
          <BigEmoji>🧠</BigEmoji>
          <BrandTitle>QuizArena</BrandTitle>
          <BrandSub>
            Test your knowledge, track your progress, and climb the leaderboard.
          </BrandSub>
          <StatRow>
            <Stat>
              <StatNum>10K+</StatNum>
              <StatLabel>Questions</StatLabel>
            </Stat>
            <Stat>
              <StatNum>50+</StatNum>
              <StatLabel>Topics</StatLabel>
            </Stat>
            <Stat>
              <StatNum>∞</StatNum>
              <StatLabel>Practice</StatLabel>
            </Stat>
          </StatRow>
        </BrandMark>
      </LeftPanel>

      {/* ── Right form panel ── */}
      <RightPanel>
        <FormCard>
          <FormHeader>
            <Eyebrow>Welcome back</Eyebrow>
            <FormTitle>Sign in to your account</FormTitle>
            <FormSub>Enter your credentials to continue</FormSub>
          </FormHeader>

          {error && <ErrorBanner>{error}</ErrorBanner>}

          <form onSubmit={onSubmit}>
            <Fields>
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
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                required
              />
            </Fields>

            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? "Signing in…" : "Sign in →"}
            </Button>
          </form>

          <FooterText>
            Don't have an account? <Link to="/register">Create one free</Link>
          </FooterText>
        </FormCard>
      </RightPanel>
    </Page>
  );
};

export default Login;