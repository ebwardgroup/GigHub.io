import "./LoginStyle.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Scrollspy from 'react-scrollspy'

// Import required components
import BgPattern from '../../components/BgPattern';
import Alert from "react-s-alert";
import Nav from '../../components/Nav';
import LandingFooter from '../../components/LandingFooter';
import Fab from '@material-ui/core/Fab';
import AngleJumbo from '../../components/AngleJumbo';
import AboutStepper from '../../components/AboutStepper';

// Import react-reveal methods for revealing content on scroll
import Slide from 'react-reveal/Slide';

// Login/landing page keeps track of user authentication state as well as user data pulled from the LinkedIn API
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
      firstName: null,
      lastName: null,
      email: null,
      pictureURL: null,
      location: null,
      id:null
    };
  }

  // Page will listen for post message to handle authentication...
  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage);
  }

  // ... and pass user auth data on to the updateProfile method
  handlePostMessage = (event) => {
    if (event.data.type === "profile") {
      debugger;
      this.updateProfile(event.data.profile);
      Alert.success(`Login successful: ${event.data.profile.firstName.localized.en_US}`,{position:'top'});
    }
  };

  // Sets state of this component to include user information from LinkedIn
  updateProfile = (profile) => {
    console.log(profile)
      this.setState({
        isAuthorized: true,
        firstName: profile.firstName.localized.en_US,
        lastName: profile.lastName.localized.en_US,
        id: profile.id,
        pictureURL: profile.profilePicture["displayImage~"].elements[3].identifiers[0].identifier
        // headline: profile.headline.localized[`${profile.headline.preferredLocale.language}_${profile.headline.preferredLocale.country}`],
        // profileUrl: `https://www.linkedin.com/in/${profile.vanityName}`,
        // summary: profile.summary.localized[`${profile.summary.preferredLocale.language}_${profile.summary.preferredLocale.country}`].rawText
      })
  }

  // Open a sign-in window, which queries the LinkedIn API to get back an authorization token
  requestProfile = () => {
    var oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=r_liteprofile%20r_emailaddress%20w_member_social&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`

    var width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrl,
      "Linkedin",
      "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
        width +
        ", height=" +
        height +
        ", top=" +
        top +
        ", left=" +
        left
    );
  };

  render() {

    // Function checks state of component, and will redirect user to their dashboard if LinkedIn auth is successful and simultaneously pass down user info as props to the dashboard
    if (this.state.isAuthorized) {
        return <Redirect to={{
          pathname: '/dashboard', 
          state: {
            id: this.state.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            pictureURL: this.state.pictureURL
          }
        }}  
        />
    }

    return ( 
    <div className="page-container"> 
      <div className="Landing">
        <BgPattern />

        <Nav />
        <Slide top>
          <div> 
            <AngleJumbo />
          </div>
        </Slide> 

        <Scrollspy items={ ['section-2'] } currentClassName="is-current">
        <div className='scrollspy-container'>
        <ul className='nav-ul'>
        <li className="nav-arrows">
          <a href="#section-2">
            <svg class="arrows">
              <path d="M0 20 L20 42 L40 20"></path>
              <path d="M0 40 L20 62 L40 40"></path>
            </svg>
          </a>
        </li>
        </ul>
        </div>
        </Scrollspy>

        <div className="App-body section-2">
          <AboutStepper />
          <Fab variant="extended" aria-label="Delete" onClick={this.requestProfile} color='primary' className="login-btn">
            <i className='fab fa-linkedin' color='primary'/>
              <span className='login-text'>
              Sign-in With LinkedIn
              </span>
          </Fab>
        </div>
      </div>
      <LandingFooter />
    </div> 
    );
  }
}

export default Login;

// {this.state.isAuthorized &&
//     (
//         <ProfileCard
//             firstName={this.state.firstName}
//             // headline={this.state.headline}
//             lastName={this.state.lastName}
//             id={this.state.id}
//             // profileURL={this.state.profileURL}
//             pictureURL={this.state.pictureURL}
//             // location={this.state.location}
//             // positions={this.state.positions}
//             // summary={this.state.summary}
//             // connectionsCount={this.state.connectionsCount}
//     />
// )} 