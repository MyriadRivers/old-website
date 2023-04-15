import { StyledButton } from './styles/Button.styled'
import PropTypes from 'prop-types'

// const Button = ({text, onClick, isActive}) => {
//     return (
//         <StyledButton onClick={onClick} isActive={isActive}>{text}</StyledButton>
//      )
// }

const Button = ({text, onClick}) => {
    return (
        <StyledButton onClick={onClick}>{text}</StyledButton>
     )
}

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
}

Button.defaultProps = {
    onClick: (e) => {
        console.log("click at ", e.clientX, ", ", e.clientY);
    }
}

export default Button