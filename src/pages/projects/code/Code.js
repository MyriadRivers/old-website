import { useOutlet } from "react-router-dom"

const Code = () => {
    const outlet = useOutlet();
    return (
      <div>{outlet || "Various coding projects that I've worked on."}</div>
    )
  }
  
  export default Code