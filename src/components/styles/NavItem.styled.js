import styled from 'styled-components';

export const StyledNavItem = styled.div`
    background-color: ${({ theme }) => theme.colors.navItem };
    font-size: calc(3.5pt + 1vw);
    padding-top: 2vw;
    padding-left: 2vw;
    padding-bottom: 1.5vw;
    padding-right: 0.5vw;
    color: ${({theme, active}) => active ? theme.colors.active : theme.colors.font};
`