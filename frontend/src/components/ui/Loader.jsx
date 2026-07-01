import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const FullScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  gap: 1rem;
`;

const Inline = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Ring = styled.div`
  width: ${({ size }) => size || "40px"};
  height: ${({ size }) => size || "40px"};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Label = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: ${pulse} 1.5s ease infinite;
`;

const Loader = ({ fullScreen, size, label = "Loading..." }) => {
  if (fullScreen) {
    return (
      <FullScreen>
        <Ring size={size} />
        <Label>{label}</Label>
      </FullScreen>
    );
  }
  return (
    <Inline>
      <Ring size={size} />
    </Inline>
  );
};

export default Loader;