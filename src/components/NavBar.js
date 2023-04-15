import { useState } from "react"
import { StyledNavBar } from "./styles/NavBar.styled";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";

const NavBar = ({items, routes, setRoute}) => {
    const [activeItem, setActiveItem] = useState(-1);

    return (
        <StyledNavBar>
            {
                items.map((item, index) => (
                    <Link key={index} to={routes[index]} onClick={() => {
                        setActiveItem(index);
                        setRoute(routes[index]);
                    }}>
                        <NavItem key={index} text={item} active={index === activeItem} />
                    </Link>
                ))
            }
        </StyledNavBar>
    )
}

export default NavBar