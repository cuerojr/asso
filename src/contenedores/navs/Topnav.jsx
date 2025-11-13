import React, { Component } from "react";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { menuHiddenBreakpoint, searchPath } from "../../constants/defaultValues";
import { getDirection, setDirection } from "../../helpers/Utils";
import { fetchLogoutUser } from "../../reducers/profile";
import { connect } from "react-redux";
import { BarraLateral } from "./BarraLateral";
import { useNavigate } from "react-router-dom";

// HOC para pasar navigate a componente clase
function withRouter(Component) {
  return function(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInFullScreen: false,
      searchKeyword: "",
    };
  }

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains("search")) {
        if (e.target.parentElement.classList.contains("search")) {
          elem = e.target.parentElement;
        } else if (e.target.parentElement.parentElement.classList.contains("search")) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
        this.removeEventsSearch();
      } else {
        elem.classList.add("mobile-view");
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };

  addEventsSearch = () => {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  };

  removeEventsSearch = () => {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: "",
      });
    }
  };

  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };

  handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search = () => {
    const { navigate } = this.props;
    this.props.navigate(searchPath + "/" + this.state.searchKeyword);
    this.setState({
      searchKeyword: "",
    });
  };

  handleLogout = () => {
    this.props.fetchLogoutUser();
    window.localStorage.removeItem("usuario");
    //window.location.href =
      //window.location.protocol + "//" + window.location.host + "/admin/user/login";
      this.props.navigate("/app/user/login");
  };

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };

  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  gestionarMiUsuario = () => {
    const { navigate } = this.props; // 🔹 Usamos navigate
    navigate("/app/mi-usuario");
  };

  render() {
    const usuario = JSON.parse(window.localStorage.getItem("usuario"));
    return (
      <>
        <nav className="navbar fixed-top container-fluid justify-content-center">
          <div className="row w-full justify-content-between align-items-center">
            <div className="col-5 col-md-5">
              <BarraLateral />
            </div>
            <div className="col-2 col-md-1 text-center p-0">
              <a className=" d-block" href="/admin/app/clientes/lista-clientes">
                <img
                  className="img-fluid"
                  src={"/admin/assets/images/logo.png"}
                  alt="Asso consultores"
                />
              </a>
            </div>
            <div className="col-5 col-md-5 text-right">
              <div className="user d-inline-block">
                <UncontrolledDropdown className="dropdown-menu-right">
                  <DropdownToggle className="p-0" color="empty">
                    <span className="name mr-1">{usuario && usuario.name}</span>
                  </DropdownToggle>
                  <DropdownMenu className="mt-3" right>
                    <DropdownItem onClick={() => this.gestionarMiUsuario()}>
                      Gestionar mi usuario
                    </DropdownItem>
                    <DropdownItem onClick={() => this.handleLogout()}>
                      Salir
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.profile.user,
    error: state.profile.error,
  };
};

export default connect(mapStateToProps, { fetchLogoutUser })(withRouter(TopNav));
