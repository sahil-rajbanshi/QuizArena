import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1.5px solid ${({ theme }) => ($error => $error
    ? theme.colors.error
    : theme.colors.border)};
  border-color: ${({ theme, $error }) => $error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-family: ${({ theme }) => theme.fonts.body};
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme, $error }) => $error ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, $error }) =>
      $error ? theme.colors.errorLight : theme.colors.primaryLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
`;

const Input = ({ label, error, id, ...props }) => (
  <Wrapper>
    {label && <Label htmlFor={id}>{label}</Label>}
    <StyledInput id={id} $error={!!error} {...props} />
    {error && <ErrorText>{error}</ErrorText>}
  </Wrapper>
);

export default Input;