    -- Creación de la base de datos
    -- CREATE DATABASE FarmaciaDB;

    -- Conexión a la base de datos (esto se ejecuta desde la línea de comandos de psql)
    -- \c FarmaciaDB

    -- 1. Configuraciones del Sistema (Variables)
    CREATE TABLE configuracion_sistema (
        clave VARCHAR(50) PRIMARY KEY,
        valor TEXT
    );

    -- 2. Tabla: usuarios
    CREATE TABLE usuarios (
        usuario_id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        rol VARCHAR(20) CHECK (rol IN ('admin', 'cajero', 'bodega')) NOT NULL,
        estado BOOLEAN DEFAULT TRUE
    );

    -- 3. Clientes
    CREATE TABLE clientes (
        cliente_id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        documento VARCHAR(20),
        telefono VARCHAR(50),
        correo VARCHAR(100),
        direccion VARCHAR(150),
        tipo_cliente VARCHAR(50)
    );

    -- 4. Tabla: Proveedores
    CREATE TABLE proveedores (
        proveedor_id SERIAL PRIMARY KEY,
        nombre VARCHAR(100),
        contacto VARCHAR(100),
        telefono VARCHAR(50),
        correo VARCHAR(100),
        direccion VARCHAR(150),
        estado BOOLEAN DEFAULT TRUE
    );

    -- 5. Tabla: temperaturas
    CREATE TABLE temperaturas (
        temperatura_id SERIAL PRIMARY KEY,
        descripcion VARCHAR(100),
        rango_temperatura VARCHAR(50)
    );

    -- 6. Tabla: Productos (Medicamentos)
    CREATE TABLE productos (
        producto_id SERIAL PRIMARY KEY,
        codigo_barras VARCHAR(50) UNIQUE,
        nombre VARCHAR(100) NOT NULL,
        concentracion VARCHAR(50),
        forma_farmaceutica VARCHAR(50),
        presentacion VARCHAR(50) NOT NULL,
        laboratorio VARCHAR(100),
        registro_sanitario VARCHAR(50),
        temperatura_id INT,
        proveedor_id INT,
        categoria VARCHAR(50),
        stock INTEGER NOT NULL DEFAULT 0,
        stock_minimo INTEGER NOT NULL DEFAULT 0,
        precio_venta DECIMAL(10,2) NOT NULL,
        estado BOOLEAN NOT NULL DEFAULT TRUE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (temperatura_id) REFERENCES temperaturas(temperatura_id),
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id)
    );

    -- 7. Tabla: Lotes (por producto)
    CREATE TABLE lotes (
        lote_id SERIAL PRIMARY KEY,
        lote_codigo VARCHAR(50) NOT NULL, -- Número de lote original (ej: "LOTE-2023-001")
        producto_id INT NOT NULL,
        fecha_vencimiento DATE NOT NULL,
        cantidad_disponible INT NOT NULL DEFAULT 0,
        precio_compra DECIMAL(10,2) NOT NULL,
        observaciones TEXT NULL,
        estado BOOLEAN NOT NULL DEFAULT FALSE,
        fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
    );

    -- 8. Tabla de presentaciones y precios de venta
    CREATE TABLE precios (
        precio_id SERIAL PRIMARY KEY,
        producto_id INT NOT NULL,
        presentacion VARCHAR(50) NOT NULL,
        equivalencia INT NOT NULL,
        precio_venta DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
    );



    -- 9. Tabla: Inventario (Resumen por producto)
    CREATE TABLE inventario (
        inventario_id SERIAL PRIMARY KEY,
        producto_id INT,
        stock_total INT DEFAULT 0,
        ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
    );

    -- 10. Tabla: Actas de Recepción
    CREATE TABLE actas (
        acta_id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL,
        fecha_recepcion DATE NOT NULL,
        ciudad VARCHAR(50) NOT NULL,
        responsable VARCHAR(50) NOT NULL,
        numero_factura VARCHAR(50) NOT NULL,
        proveedor_id INT NOT NULL,
        tipo_acta VARCHAR(50) NOT NULL,
        observaciones TEXT NULL,
        cargada_inventario BOOLEAN NOT NULL DEFAULT FALSE,
        estado VARCHAR(20) CHECK (estado IN ('Borrador', 'Aprobada')) NOT NULL DEFAULT 'Borrador',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id)
    );

    -- 11. Detalle Actas de Recepción
    CREATE TABLE actas_productos (
        acta_producto_id SERIAL PRIMARY KEY,
        acta_id INT NOT NULL,
        producto_id INT NOT NULL,
        lote_id INT NOT NULL,
        cantidad_recibida INT NOT NULL,
        precio_compra DECIMAL(10,2),
        FOREIGN KEY (acta_id) REFERENCES actas(acta_id),
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
        FOREIGN KEY (lote_id) REFERENCES lotes(lote_id)
    );

    -- 12. Ventas
CREATE TABLE ventas (
  venta_id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
  cliente_id INT REFERENCES clientes(cliente_id),
  fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  descuento_total DECIMAL(12,2) DEFAULT 0 CHECK (descuento_total >= 0),
  impuesto_total DECIMAL(12,2) DEFAULT 0 CHECK (impuesto_total >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  metodo_pago VARCHAR(20) NOT NULL 
    CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'mixto')),
  -- Nuevos campos para desglose del método de pago
  monto_efectivo DECIMAL(12, 2) DEFAULT 0,
  monto_tarjeta DECIMAL(12, 2) DEFAULT 0,
  monto_transferencia DECIMAL(12, 2) DEFAULT 0,
  cambio DECIMAL(12, 2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'completada'
    CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


    -- 13. Detalle de Ventas
    CREATE TABLE detalle_venta (
  detalle_venta_id SERIAL PRIMARY KEY,
  venta_id INT NOT NULL REFERENCES ventas(venta_id) ON DELETE CASCADE,
  producto_id INT NOT NULL REFERENCES productos(producto_id),
  lote_id INT NOT NULL REFERENCES lotes(lote_id),
  cantidad DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0), -- cantidad * precio_unitario
  descuento DECIMAL(5,2) DEFAULT 0,
  impuesto DECIMAL(5,2) DEFAULT 0,
  total_linea DECIMAL(12,2) NOT NULL CHECK (total_linea >= 0), -- subtotal - descuento + impuesto
  devuelto BOOLEAN DEFAULT FALSE,
  cantidad_devuelta DECIMAL(10,3) DEFAULT 0
);



    -- 14. Alertas de Vencimiento
    CREATE TABLE alertas_vencimiento (
        alerta_id SERIAL PRIMARY KEY,
        lote_id INT NOT NULL,
        fecha_alerta TIMESTAMP,
        dias_anticipacion INT,
        estado BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (lote_id) REFERENCES lotes(lote_id)
    );

    -- 15. Devoluciones y Detalles
    CREATE TABLE devoluciones (
    devolucion_id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL REFERENCES ventas(venta_id),
    usuario_id INT NOT NULL REFERENCES usuarios(usuario_id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('parcial', 'total')),
    motivo VARCHAR(100) NOT NULL,
    observaciones TEXT,
    monto_total DECIMAL(12,2) NOT NULL CHECK (monto_total >= 0),
    metodo_reembolso VARCHAR(20) CHECK (metodo_reembolso IN ('efectivo', 'tarjeta', 'transferencia', 'credito')),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'rechazada')),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    -- 16. Detalle Devoluciones
    CREATE TABLE detalle_devolucion (
    detalle_devolucion_id SERIAL PRIMARY KEY,
    devolucion_id INT NOT NULL REFERENCES devoluciones(devolucion_id) ON DELETE CASCADE,
    detalle_venta_id INT NOT NULL REFERENCES detalle_venta(detalle_venta_id),
    cantidad_devuelta DECIMAL(10,3) NOT NULL CHECK (cantidad_devuelta > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    motivo VARCHAR(100),
    lote_id INT NOT NULL REFERENCES lotes(lote_id),
    monto_linea DECIMAL(12,2) GENERATED ALWAYS AS (cantidad_devuelta * precio_unitario) STORED
);

    -- 17. Facturas
    CREATE TABLE facturas (
        factura_id SERIAL PRIMARY KEY,
        venta_id INT,
        cliente_id INT,
        numero_factura VARCHAR(50),
        fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(20),
        FOREIGN KEY (venta_id) REFERENCES ventas(venta_id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id)
    );

    -- 18. Ajustes de Inventario
    CREATE TABLE ajustes_inventario (
        ajuste_id SERIAL PRIMARY KEY,
        usuario_id INT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        motivo VARCHAR(100),
        observaciones TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
    );

    -- 19. Detalle Ajustes de Inventario
    CREATE TABLE detalle_ajuste_inventario (
        detalle_ajuste_inventario_id SERIAL PRIMARY KEY,
        ajuste_id INT,
        lote_id INT,
        cantidad_antes INT,
        cantidad_despues INT,
        FOREIGN KEY (ajuste_id) REFERENCES ajustes_inventario(ajuste_id),
        FOREIGN KEY (lote_id) REFERENCES lotes(lote_id)
    );


    -- 20. Órdenes de Compra
    CREATE TABLE ordenes_compra (
        orden_compra_id SERIAL PRIMARY KEY,
        fecha DATE DEFAULT CURRENT_DATE,
        proveedor_id INT,
        usuario_id INT,
        observaciones TEXT,
        estado VARCHAR(20) CHECK (estado IN ('Pendiente', 'Recibida', 'Cancelada')) DEFAULT 'Pendiente',
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
    );

    -- 21. Detalle Órdenes de Compra
    CREATE TABLE detalle_orden_compra (
        detalle_orden_compra_id SERIAL PRIMARY KEY,
        orden_compra_id INT,
        producto_id INT,
        cantidad INT,
        precio_unitario DECIMAL(10,2),
        FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(orden_compra_id),
        FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
    );

    -- 22. Órdenes de Salida
    CREATE TABLE ordenes_salida (
        orden_salida_id SERIAL PRIMARY KEY,
        fecha DATE DEFAULT CURRENT_DATE,
        usuario_id INT,
        motivo VARCHAR(100),
        observaciones TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
    );

    -- 23. Detalle Órdenes de Salida
    CREATE TABLE detalle_orden_salida (
        detalle_orden_salida_id SERIAL PRIMARY KEY,
        orden_salida_id INT,
        lote_id INT,
        cantidad INT,
        FOREIGN KEY (orden_salida_id) REFERENCES ordenes_salida(orden_salida_id),
        FOREIGN KEY (lote_id) REFERENCES lotes(lote_id)
    );

    -- 24. Historial de Cambios
    CREATE TABLE historial_cambios (
        cambio_id SERIAL PRIMARY KEY,
        usuario_id INT,
        tabla VARCHAR(100),
        accion VARCHAR(50),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        detalles TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
    );

    -- Tipos compuestos (PostgreSQL usa una sintaxis diferente)
    CREATE TYPE DetalleVentaType AS (
        lote_id INT,
        cantidad INT,
        unidad VARCHAR(50),
        precio_venta DECIMAL(10,2)
    );

    CREATE TYPE DetalleAjusteType AS (
        lote_id INT,
        cantidad_antes INT,
        cantidad_despues INT
    );

    CREATE TYPE RegistrarVentaType AS (
        lote_id INT,
        cantidad_antes INT,
        cantidad_despues INT
    );

    CREATE TYPE DetalleDevolucionType AS (
        lote_id INT,
        cantidad_antes INT,
        cantidad_despues INT
    );


    -- Función para calcular Precio Promedio Ponderado
    CREATE OR REPLACE FUNCTION calcular_ppp(producto_id INT) 
    RETURNS DECIMAL(10,2) AS $$
    DECLARE
        promedio DECIMAL(10,2);
    BEGIN
        SELECT 
            COALESCE(
                SUM(l.precio_compra * l.cantidad_disponible) / 
                NULLIF(SUM(l.cantidad_disponible), 0),
                0
            ) INTO promedio
        FROM lotes l
        WHERE l.producto_id = $1
        AND l.estado = true;
        
        RETURN ROUND(promedio, 2);
    END;
    $$ LANGUAGE plpgsql;


    -- Índices recomendados para mejorar el rendimiento
    CREATE INDEX idx_lotes_producto_id ON lotes(producto_id);
    CREATE INDEX idx_lotes_fecha_vencimiento ON lotes(fecha_vencimiento);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_detalle_producto ON detalle_venta(producto_id);
    -- Índices para búsquedas rápidas
    CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
    CREATE INDEX idx_productos_nombre ON productos(nombre);
    CREATE INDEX idx_productos_registro ON productos(registro_sanitario);