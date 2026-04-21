import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";

import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const BuscarMensaje = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearchClick = () => {
    if (onSearch && inputValue.trim() !== "") {
      onSearch(inputValue.trim());
    }
  };

  const handleClearClick = () => {
    setInputValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <InputGroup className="mb-3">
      <InputGroupAddon addonType="prepend">
        Buscar Mensaje
      </InputGroupAddon>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ingrese mensaje a buscar"
      />
      {inputValue && (
        <button
          onClick={handleClearClick}
          style={{
            border: "none",
            background: "#333",
            cursor: "pointer",
            padding: "0 1rem",
            borderRight: "3px solid var(--foreground-color)",
          }}
          title="Limpiar búsqueda"
        >
          <FontAwesomeIcon icon={faTimes} style={{ color: "#fff" }} />
        </button>
      )}

      <button
        onClick={handleSearchClick}
        style={{
          border: "0px",
          cursor: "pointer",
          background: "#333",
          padding: "1rem 2rem",
        }}
      >
        <FontAwesomeIcon icon={faSearch} style={{ color: "#fff" }} />
      </button>
    </InputGroup>
  );
};

export default BuscarMensaje;
