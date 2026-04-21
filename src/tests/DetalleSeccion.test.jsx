import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DetalleSeccion from '../componentes/detalleSeccion';
import { fetchdeleteSeccion, fetchUpdateSeccion } from '../reducers/secciones-reducer';
import { altaEquipo } from '../lib/equipos-api';
import { NotificationManager } from '../components/common/react-notifications';

// Mock de dependencias
jest.mock('../reducers/secciones-reducer');
jest.mock('../lib/equipos-api');
jest.mock('../components/common/react-notifications', () => ({
  NotificationManager: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  }
}));
jest.mock('../componentes/nuevoEquipo', () => {
  return function NuevoEquipo() {
    return <div data-testid="nuevo-equipo-modal">Nuevo Equipo Modal</div>;
  };
});

// Configurar store con middleware thunk
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('DetalleSeccion Component', () => {
  let store;
  let mockProps;

  beforeEach(() => {
    // Configuración del store de Redux
    store = mockStore({
      informesReducer: {
        detalleInforme: null
      }
    });

    // Props mock del componente
    mockProps = {
      seccion: {
        id: 1,
        id_empresa: 10,
        nombre: 'Sección Test',
        observacion: 'Observación de prueba',
        estado: 1,
        informes: 5,
        equipos: 3
      },
      abrirModal: jest.fn(),
      salirSeleccion: jest.fn(),
      recargarSecciones: jest.fn(),
      volverSecciones: jest.fn(),
      nombreEmpresa: 'Empresa Test'
    };

    // Mockear las acciones para que retornen thunks (funciones)
    fetchUpdateSeccion.mockImplementation(() => {
      return (dispatch) => {
        return Promise.resolve({ type: 'UPDATE_SECCION_SUCCESS' });
      };
    });

    fetchdeleteSeccion.mockImplementation(() => {
      return (dispatch) => {
        return Promise.resolve({ type: 'DELETE_SECCION_SUCCESS' });
      };
    });

    // Limpiar mocks
    jest.clearAllMocks();
  });

  // TEST 1: Renderizado básico del componente
  test('renderiza correctamente con los datos de la sección', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    expect(screen.getByDisplayValue('Sección Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Observación de prueba')).toBeInTheDocument();
    expect(screen.getByText(/5 Informes/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Equipos/i)).toBeInTheDocument();
  });

  // TEST 2: Cambio de nombre de sección
  test('actualiza el nombre de la sección al escribir', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const inputNombre = screen.getByDisplayValue('Sección Test');
    fireEvent.change(inputNombre, { target: { value: 'Nuevo Nombre' } });

    expect(screen.getByDisplayValue('Nuevo Nombre')).toBeInTheDocument();
  });

  // TEST 3: Cambio de observación
  test('actualiza la observación al escribir en el textarea', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const textarea = screen.getByDisplayValue('Observación de prueba');
    fireEvent.change(textarea, { target: { value: 'Nueva observación' } });

    expect(screen.getByDisplayValue('Nueva observación')).toBeInTheDocument();
  });

  // TEST 4: Cambio de estado (switch)
  test('cambia el estado de la sección al hacer click en el switch', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const switchElement = screen.getByRole('checkbox');
    expect(screen.getByText('Sección habilitada')).toBeInTheDocument();

    fireEvent.click(switchElement);
    expect(screen.getByText('Sección deshabilitada')).toBeInTheDocument();
  });

  // TEST 5: Guardar cambios
  test('llama a actualizarSeccion al hacer click en GUARDAR CAMBIOS', async () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const botonGuardar = screen.getByText('GUARDAR CAMBIOS');
    fireEvent.click(botonGuardar);

    await waitFor(() => {
      expect(fetchUpdateSeccion).toHaveBeenCalledWith(
        1, 10, 'Sección Test', 'Observación de prueba', 1
      );
      expect(NotificationManager.success).toHaveBeenCalledWith(
        "La sección ha sido actualizada", "Hecho", 3000, null, null, ''
      );
      expect(mockProps.salirSeleccion).toHaveBeenCalled();
      expect(mockProps.recargarSecciones).toHaveBeenCalledWith(10);
    });
  });

  // TEST 6: Eliminar sección sin informes
  test('muestra modal de confirmación al eliminar sección sin informes', () => {
    const propsSeccionVacia = {
      ...mockProps,
      seccion: { ...mockProps.seccion, informes: 0 }
    };

    render(
      <Provider store={store}>
        <DetalleSeccion {...propsSeccionVacia} />
      </Provider>
    );

    const botonEliminar = screen.getByText(/ELIMINAR SECCIÓN/i);
    fireEvent.click(botonEliminar);

    expect(screen.getByText(/Vas a eliminar esta sección. ¿Estás seguro?/i)).toBeInTheDocument();
  });

  // TEST 7: Eliminar sección con informes
  test('muestra advertencia al intentar eliminar sección con informes', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const botonEliminar = screen.getByText(/ELIMINAR SECCIÓN/i);
    fireEvent.click(botonEliminar);

    expect(screen.getByText(/Esta sección tiene informes cargados/i)).toBeInTheDocument();
  });

  // TEST 8: Confirmar eliminación de sección
  test('elimina la sección al confirmar en el modal', async () => {
    const propsSeccionVacia = {
      ...mockProps,
      seccion: { ...mockProps.seccion, informes: 0 }
    };

    render(
      <Provider store={store}>
        <DetalleSeccion {...propsSeccionVacia} />
      </Provider>
    );

    // Abrir modal de confirmación
    const botonEliminar = screen.getByText(/ELIMINAR SECCIÓN/i);
    fireEvent.click(botonEliminar);

    // Confirmar borrado
    const botonBorrar = screen.getByText('Borrar');
    fireEvent.click(botonBorrar);

    await waitFor(() => {
      expect(fetchdeleteSeccion).toHaveBeenCalledWith(1);
      expect(NotificationManager.success).toHaveBeenCalledWith(
        "La sección ha sido eliminada", "Hecho", 3000, null, null, ''
      );
      expect(mockProps.salirSeleccion).toHaveBeenCalled();
      expect(mockProps.recargarSecciones).toHaveBeenCalledWith(10);
    });
  });

  // TEST 9: Cerrar modal de advertencia
  test('cierra el modal de advertencia al hacer click en Cerrar', async () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const botonEliminar = screen.getByText(/ELIMINAR SECCIÓN/i);
    fireEvent.click(botonEliminar);

    const botonCerrar = screen.getByText('Cerrar');
    fireEvent.click(botonCerrar);

    // Esperar a que el modal se cierre
    await waitFor(() => {
      const modal = screen.queryByText(/Esta sección tiene informes cargados/i);
      // El modal debería no ser visible o no estar en el documento
      expect(modal).not.toBeInTheDocument();
    });
  });

  // TEST 10: Botón volver a secciones
  test('llama a volverSecciones al hacer click en el botón Volver', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const botonVolver = screen.getByText('< Secciones');
    fireEvent.click(botonVolver);

    expect(mockProps.volverSecciones).toHaveBeenCalled();
  });

  // TEST 11: Abrir modal nuevo informe
  test('abre modal de nuevo informe al hacer click en NUEVO INFORME', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const botonNuevoInforme = screen.getByText(/NUEVO INFORME/i);
    fireEvent.click(botonNuevoInforme);

    expect(mockProps.abrirModal).toHaveBeenCalledWith(10, 1);
  });

  // TEST 12: Estado inicial del switch
  test('muestra el estado correcto del switch según prop estado', () => {
    render(
      <Provider store={store}>
        <DetalleSeccion {...mockProps} />
      </Provider>
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeChecked();
  });

  // TEST 13: Sección deshabilitada inicialmente
  test('renderiza correctamente cuando la sección está deshabilitada', () => {
    const propsDeshabilitada = {
      ...mockProps,
      seccion: { ...mockProps.seccion, estado: 0 }
    };

    render(
      <Provider store={store}>
        <DetalleSeccion {...propsDeshabilitada} />
      </Provider>
    );

    expect(screen.getByText('Sección deshabilitada')).toBeInTheDocument();
  });

  // TEST 14: Cancelar eliminación
  test('cierra modal de confirmación al hacer click en Cancelar', async () => {
    const propsSeccionVacia = {
      ...mockProps,
      seccion: { ...mockProps.seccion, informes: 0 }
    };

    render(
      <Provider store={store}>
        <DetalleSeccion {...propsSeccionVacia} />
      </Provider>
    );

    const botonEliminar = screen.getByText(/ELIMINAR SECCIÓN/i);
    fireEvent.click(botonEliminar);

    const botonCancelar = screen.getByText('Cancelar');
    fireEvent.click(botonCancelar);

    // Esperar a que el modal se cierre
    await waitFor(() => {
      const modal = screen.queryByText(/Vas a eliminar esta sección/i);
      expect(modal).not.toBeInTheDocument();
    });
  });
});