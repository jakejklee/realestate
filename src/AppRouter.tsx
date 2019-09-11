import React from 'react';
import MainPage from './components/screens/MainPage';
import HomePage from './components/screens/HomePage';
import Announcement from './components/screens/Announcement';
import { BrowserRouter as Router, Route, } from 'react-router-dom';

interface Props {
}

class AppRouter extends React.Component<Props> {

    render() {
        return (
            <Router>
                <div style={{ height: "100vh", overflow: 'auto' }}>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/map" component={MainPage} />
                    <Route path="/announcement" component={Announcement} />
                    {/* <Route path="/Mmap" component={MobileMap} /> */}
                </div>
            </Router>
        )
    }
}

export default AppRouter;
