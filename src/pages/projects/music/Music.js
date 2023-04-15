import { useOutlet } from "react-router-dom"

const Music = () => {
    const outlet = useOutlet();
    return (
      <div>{outlet || "Music that I've made and some music technology projects."}</div>
    )
  }
  
export default Music