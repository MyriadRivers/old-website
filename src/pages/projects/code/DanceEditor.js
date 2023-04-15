import Subtitle from "../../../components/Subtitle"
import Image from "../../../components/Image"
import danceEditorScreenshot from "../../../resources/images/dance_editor.png"
import { Caption } from "../../../components/styles/Caption.styled"

const DanceEditor = () => {
  return (
    <div>
      <Subtitle title={"DANCE EDITOR"} subtitle={"August - December 2021"} />
      <br />
      <Image url={danceEditorScreenshot} alt={"Screenshot of the dance editor web application."} width={"75%"}/>
      <Caption>Screenshot of the dance editor web application.</Caption>
      <br />
      Web application developed in JavaScript using the Vue.js framework for editing and choreographing dance routines for 
      Georgia Tech’s Forest, an initiative that investigates human-robot interaction and gestural communication through 
      a set of 12 robotic arms that can interact and dance with human performers. 
      <br />
      <br />
      A routine is formed out of discrete, preprogrammed dance steps for each of the 12 specific robotic arms to perform, 
      which can be interspersed with periods of responsive motion based on live interactions with people. 
      <br />
      <br />
      Formerly, routines were made by manually editing a spreadsheet to specify joints moved, angles of rotation, and speed. 
      The web app provides a more user-friendly method of selecting dance steps, sequencing and viewing them in a timeline, 
      and outputting the result in the necessary format for the robot arms to interpret. 

    </div>
  )
}

export default DanceEditor