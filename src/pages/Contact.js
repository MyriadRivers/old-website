import { LinksContainer } from "../components/containers/LinksContainer"

const Contact = () => {
  return (
    <LinksContainer>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      Contact links:
      <br />
      <a href="mailto: jgaominneapolis@gmail.com" class="fa fa-envelope" > </a>
      <a href="https://www.linkedin.com/in/jason-gao-403051198" class="fa fa-linkedin" > </a>
      <br />
      <br />
      Art links:
      <br />
      <a href="https://www.youtube.com/@riiiver" class="fa fa-youtube" > </a>
      <a href="https://www.instagram.com/manifoldrivers/" class="fa fa-instagram" > </a>
      <br />
      <br />
      Bugs link:
      <br />
      <a href="https://www.instagram.com/riveroptera/" class="fa fa-instagram" > </a>
    </LinksContainer>
  )
}

export default Contact