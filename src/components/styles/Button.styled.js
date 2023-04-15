import styled from 'styled-components';

export const StyledButton = styled.div`
    &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.colors.active };
    }

    &:active {
        color: ${({ theme }) => theme.colors.selected };
    }
`