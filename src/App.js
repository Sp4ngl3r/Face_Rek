import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRek from "./components/FaceRek/FaceRek";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

import "./App.css";

const particleData = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 600,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  userSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  //componentDidMount() {
  //   fetch("http://localhost:3000")
  //     .then((response) => response.json())
  //     .then(console.log)
  //     .catch((err) => console.log(err));
  // }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocation = (apiData) => {
    const clarifaiBoxData =
      apiData.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("urlImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiBoxData.left_col * width,
      topRow: clarifaiBoxData.top_row * height,
      rightCol: width - clarifaiBoxData.right_col * width,
      bottomRow: height - clarifaiBoxData.bottom_row * height,
    };
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  displayBox = (box) => {
    //console.log(box);
    this.setState({ box: box });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayBox(this.calculateFaceLocation(response));
      })
      .catch((error) => console.log(error));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ userSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { userSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleData} />
        <Navigation
          userSignedIn={userSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRek box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
