import styled from "styled-components";

export const StyledHeader = styled.div`
    background-color: ${({ theme }) => theme.colors.header};
    font-size: calc(5vw);
    text-align: right;
    padding-top: 2.5vw;
    padding-right: 3vw;
    color: ${({ theme }) => theme.colors.font};
`