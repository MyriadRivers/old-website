import styled from "styled-components";

export const Caption = styled.div`
    font-size: calc(5pt + 0.5vw);
    color: ${({ theme }) => theme.colors.subtitle };
`