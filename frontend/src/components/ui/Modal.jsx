import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: ${fadeIn} ${({ theme }) => theme.transitions.fast};
  padding: 1rem;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || "500px"};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${slideUp} ${({ theme }) => theme.transitions.base};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.2rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.textPrimary}; }
`;

const Modal = ({ isOpen, onClose, title, children, maxWidth }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Box $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseBtn onClick={onClose}>×</CloseBtn>
          </Header>
        )}
        {children}
      </Box>
    </Overlay>
  );
};

export default Modal;