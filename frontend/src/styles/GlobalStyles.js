import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
    &:hover { color: ${({ theme }) => theme.colors.primaryHover}; }
  }

  button { cursor: pointer; font-family: ${({ theme }) => theme.fonts.body}; border: none; outline: none; }

  input, textarea, select { font-family: ${({ theme }) => theme.fonts.body}; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.surface}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.full};
    &:hover { background: ${({ theme }) => theme.colors.primary}; }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export default GlobalStyles;
