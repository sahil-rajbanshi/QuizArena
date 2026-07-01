import { useRouteError } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: 2rem;
`;

const Card = styled.div`
  max-width: 480px;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2.5rem 2rem;
`;

const Emoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 1.5rem;
`;

const ErrorDetails = styled.pre`
  text-align: left;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  overflow-x: auto;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RouteErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);

  return (
    <Wrapper>
      <Card>
        <Emoji>⚠️</Emoji>
        <Title>Something went wrong</Title>
        <Message>The app hit an unexpected error. Try reloading.</Message>
        {import.meta.env.DEV && (
          <ErrorDetails>
            {error?.message || error?.statusText || String(error)}
          </ErrorDetails>
        )}
        <Button onClick={() => (window.location.href = "/")} size="lg">
          Reload App
        </Button>
      </Card>
    </Wrapper>
  );
};

export default RouteErrorBoundary;