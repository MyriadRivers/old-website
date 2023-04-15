import styled from "styled-components";

export const StyledNavBar = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.navBar };
    height: 100%;
    text-align: right;
    gap: 10px;
`