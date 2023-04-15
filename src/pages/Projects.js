import { useOutlet } from "react-router-dom"

const Projects = () => {
  const outlet = useOutlet();
  return (
    <div>{outlet || "Check out some of the stuff I've done!"}</div>
  )
}

export default Projects