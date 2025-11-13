import React, { Component } from "react";

import TopNav from "../contenedores/navs/Topnav";
import { BarraLateral } from "../contenedores/navs/BarraLateral";
import Footer from "../contenedores/navs/Footer";

export default class AppLayout extends Component {
  render() {
    return (
      <div id="app-container" className="menu-default sub-hidden relative">
        {/* TopNav ya usa navigate internamente */}
        <TopNav />
        {/* BarraLateral ya se importa dentro de TopNav o puede dejarse comentada */}
        {/* <BarraLateral /> */}
        <main>
          <div className="container p-0" id="contenedor">
            {this.props.children}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
