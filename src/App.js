import { ThemeProvider } from 'styled-components';
import { BlockTheme, RiverTheme, DarkTheme } from './components/styles/Themes';

import { Container } from './components/containers/Container'
import { NavBarContainer } from './components/containers/NavBarContainer';
import { PageContainer } from './components/containers/PageContainer';
import GlobalStyles from './components/styles/GlobalStyles';
import { StyledRiver } from './components/styles/River.styled';
import Header from './components/Header'
import NavBar from './components/NavBar';

import  {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Code from './pages/projects/code/Code';
import Music from './pages/projects/music/Music';

import Shaders from './pages/projects/code/Shaders';
import DanceEditor from './pages/projects/code/DanceEditor';
import RayTracer from './pages/projects/code/RayTracer';
import MusicEditor from './pages/projects/code/MusicEditor';
import AuditoryInterface from './pages/projects/code/AuditoryInterface';

import NyanCatRemix from './pages/projects/music/NyanCatRemix';
import SyncOrSink from './pages/projects/music/SyncOrSink';
import VocaloidSimulation from './pages/projects/music/VocaloidSimulation';
import Voicemail from './pages/projects/music/Voicemail';

import { useState } from 'react'
import OrbWeaver from './pages/projects/music/OrbWeaver';

function App() {
  const rootNavItems = ["about", "projects", "contact"]
  const rootRoutes = ["/", "projects", "contact"]
  const projectNavItems = ["code", "music"]
  const projectRoutes = ["projects/code", "projects/music"]
  const codeNavItems = ["music editor", "dance editor", "ray tracer", "shaders", "auditory interface"]
  const codeRoutes = ["projects/code/music_editor", "projects/code/dance_editor", "projects/code/ray_tracer", "projects/code/shaders", "projects/code/auditory_interface"]
  const musicNavItems = ["orb weaver", "voicemail", "nyan cat - remix", "vocaloid simulation", "sync or sink"]
  const musicRoutes = ["projects/music/orb_weaver", "projects/music/voicemail", "projects/music/nyan_cat_remix", "projects/music/vocaloid_simulation", "projects/music/sync_or_sink"]

  const [route, setRoute] = useState("/")

  const theme = RiverTheme;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyles />
        <Router>
          {/* <MenuBar /> */}
          <NavBarContainer>
            <NavBar items={rootNavItems} routes={rootRoutes} setRoute={setRoute}/>
            <StyledRiver backgroundColor={theme.colors.river2}/>
            <StyledRiver backgroundColor={theme.colors.river}/>
            {window.location.pathname.match(/^\/projects/) && <NavBar items={projectNavItems} routes={projectRoutes} setRoute={setRoute}/>}
            <StyledRiver backgroundColor={theme.colors.river2}/>
            <StyledRiver backgroundColor={theme.colors.river}/>
            {window.location.pathname.match(/^\/projects\/code/) && <NavBar items={codeNavItems} routes={codeRoutes} setRoute={setRoute}/>}
            {window.location.pathname.match(/^\/projects\/music/) && <NavBar items={musicNavItems} routes={musicRoutes} setRoute={setRoute}/>}
            <StyledRiver backgroundColor={theme.colors.river2}/>
            <StyledRiver backgroundColor={theme.colors.river}/>
          </NavBarContainer>
          <div className="content">
            <Header text={'JASON GAO'}/>
            <div className="pageContainer">
              <PageContainer>
                <Routes>
                  <Route path="/" element={<About />} />
                  <Route path="projects" element={<Projects />}>
                    <Route path="code" element={<Code />} >
                      <Route path="music_editor" element={<MusicEditor />} />
                      <Route path="dance_editor" element={<DanceEditor />} />
                      <Route path="ray_tracer" element={<RayTracer />} />
                      <Route path="shaders" element={<Shaders />} />
                      <Route path="auditory_interface" element={<AuditoryInterface />} />
                    </Route>
                    <Route path="music" element={<Music />} >
                      <Route path="orb_weaver" element={<OrbWeaver />} />
                      <Route path="voicemail" element={<Voicemail />} />
                      <Route path="nyan_cat_remix" element={<NyanCatRemix />} />
                      <Route path="vocaloid_simulation" element={<VocaloidSimulation />} />
                      <Route path="sync_or_sink" element={<SyncOrSink />} />
                    </Route>   
                  </Route>
                  <Route path="contact" element={<Contact />} />
                </Routes>
              </PageContainer>
            </div>
          </div>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
