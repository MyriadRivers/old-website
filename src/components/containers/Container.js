import styled from "styled-components";

export const Container = styled.div`
    background-color: ${({ theme }) => theme.colors.body };
    display: flex;
    width: 100%;
    height: 100%;
    position: fixed;

    .content {
        flex: 1;
    }

    .pageContainer {
        padding-top: 1vw;
        padding-left: 3vw;
        padding-right: 3vw;
        height: 82%;
        font-size: calc(4pt + 1vw);
        line-height: 1.5;
        overflow-y: auto;
        overflow-x: auto;
    }
`