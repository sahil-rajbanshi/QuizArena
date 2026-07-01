import styled from "styled-components";

const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ $padding }) => $padding || "1.5rem"};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow ${({ theme }) => theme.transitions.base};

  ${({ $hoverable, theme }) => $hoverable && `
    cursor: pointer;
    &:hover {
      box-shadow: ${theme.shadows.glow};
      border-color: ${theme.colors.primary};
    }
  `}
`;

const Card = ({ children, padding, hoverable, ...props }) => (
  <StyledCard $padding={padding} $hoverable={hoverable} {...props}>
    {children}
  </StyledCard>
);

export default Card;