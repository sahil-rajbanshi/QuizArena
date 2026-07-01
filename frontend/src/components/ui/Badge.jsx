import styled from "styled-components";

const colors = {
  primary: { bg: "primaryLight", text: "primary" },
  accent:  { bg: "accentLight",  text: "accent"  },
  success: { bg: "successLight", text: "success" },
  error:   { bg: "errorLight",   text: "error"   },
  muted:   { bg: "surfaceAlt",   text: "textSecondary" },
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ theme, $variant }) => theme.colors[colors[$variant]?.bg || "primaryLight"]};
  color: ${({ theme, $variant }) => theme.colors[colors[$variant]?.text || "primary"]};
  white-space: nowrap;
`;

const Badge = ({ variant = "primary", children, ...props }) => (
  <StyledBadge $variant={variant} {...props}>
    {children}
  </StyledBadge>
);

export default Badge;