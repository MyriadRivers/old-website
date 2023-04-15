import { createGlobalStyle } from "styled-components";
import AsketNarrowOtf from "../../resources/fonts/AsketNarrowLight.otf";
import AsketNarrowEot from "../../resources/fonts/AsketNarrowLight.eot";
import AsketNarrowSvg from "../../resources/fonts/AsketNarrowLight.svg";
import AsketNarrowTtf from "../../resources/fonts/AsketNarrowLight.ttf";
import AsketNarrowWoff from "../../resources/fonts/AsketNarrowLight.woff";
// import AsketNarrowWoff2 from "../../resources/fonts/AsketNarrowLight.woff2";

const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Asket Narrow';
        src: url(${AsketNarrowOtf}) format('otf'),
             url(${AsketNarrowEot}) format('embedded-opentype'),
             url(${AsketNarrowWoff}) format('woff'),
             url(${AsketNarrowTtf}) format('truetype'),
             url(${AsketNarrowSvg}) format('svg');
    }

    #root, html {
        height: 100%;
        color: ${({ theme }) => theme.colors.font };
    }
    body {
        font-family: 'Asket Narrow';
        background-color: white;
        height: 100%;
        padding: 0;
        margin: 0;
    }
    a:link {
        color: ${({ theme }) => theme.colors.link };
        text-decoration: none;
        background-color: none;
    }
    a:hover {
        color: ${({ theme }) => theme.colors.linkHover };
    }
    a:visited {
        color: ${({ theme }) => theme.colors.linkVisit };
    }
    a:visited:hover {
        color: ${({ theme }) => theme.colors.linkHover };
    }
`
export default GlobalStyles