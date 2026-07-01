import styled, { css } from "styled-components";

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      box-shadow: ${({ theme }) => theme.shadows.glow};
    }
  `,
  accent: css`
    background: ${({ theme }) => theme.colors.accent};
    color: #0D0F1C;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentHover};
      box-shadow: ${({ theme }) => theme.shadows.glowAccent};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1.5px solid ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceAlt};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.error};
    color: #fff;
    &:hover:not(:disabled) {
      filter: brightness(1.1);
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.4rem 0.9rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    padding: 0.6rem 1.4rem;
    font-size: ${({ theme }) => theme.fontSizes.md};
  `,
  lg: css`
    padding: 0.85rem 2rem;
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $variant }) => variants[$variant || "primary"]}
  ${({ $size }) => sizes[$size || "md"]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }
`;

const Button = ({ variant, size, fullWidth, children, ...props }) => (
  <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
    {children}
  </StyledButton>
);

export default Button;