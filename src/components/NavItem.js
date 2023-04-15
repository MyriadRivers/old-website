import { StyledNavItem } from "./styles/NavItem.styled"
import Button from "./Button"

const NavItem = ({text, active, onClick}) => {
  return (
    <StyledNavItem active={active}>
        <Button text={text.toUpperCase()} onClick={onClick}/>
    </StyledNavItem>
  )
}

export default NavItem