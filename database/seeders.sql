-- 1. Configuraciones del Sistema
INSERT INTO configuracion_sistema (clave, valor) VALUES

('iva_porcentaje', '19.00'),
('nombre_farmacia', 'Farmacia Salud Integral'),
('direccion_farmacia', 'Calle Principal 123, Ciudad'),
('telefono_farmacia', '+1234567890'),
('dias_alerta_vencimiento', '30');

-- 2. Usuarios
INSERT INTO usuarios (nombre, correo, contraseña, rol, estado) VALUES
('Admin Principal', 'admin@farmacia.com', '$2a$10$xJwL5v5Jz5U6Z5b5Z5b5Ze', 'admin', TRUE),
('Carlos Mendoza', 'carlos@farmacia.com', '$2a$10$xJwL5v5Jz5U6Z5b5Z5b5Ze', 'cajero', TRUE),
('María González', 'maria@farmacia.com', '$2a$10$xJwL5v5Jz5U6Z5b5Z5b5Ze', 'bodega', TRUE),
('Luisa Fernández', 'luisa@farmacia.com', '$2a$10$xJwL5v5Jz5U6Z5b5Z5b5Ze', 'cajero', TRUE),
('Pedro Ramírez', 'pedro@farmacia.com', '$2a$10$xJwL5v5Jz5U6Z5b5Z5b5Ze', 'bodega', FALSE);

-- 3. Clientes
INSERT INTO clientes (nombre, documento, telefono, correo, direccion, tipo_cliente) VALUES
('Cliente General', '0000000000', '0999999999', 'general@cliente.com', 'N/A', 'General'),
('Juan Pérez', '0101010101', '0912345678', 'juan@email.com', 'Av. Principal 456', 'Frecuente'),
('Ana López', '0202020202', '0923456789', 'ana@email.com', 'Calle Secundaria 789', 'Ocasional'),
('Empresa XYZ', '0303030303', '0934567890', 'contacto@xyz.com', 'Av. Industrial 123', 'Corporativo'),
('María García', '0404040404', '0945678901', 'maria@email.com', 'Calle Nueva 321', 'Frecuente');

-- 4. Proveedores
INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, estado) VALUES
('Farmacéutica Nacional', 'Dr. Roberto Martínez', '021234567', 'contacto@fnacional.com', 'Av. Industrial 456', TRUE),
('Laboratorios Salud', 'Lic. Laura Fernández', '022345678', 'ventas@lab-salud.com', 'Calle Científica 789', TRUE),
('Distribuidora Médica', 'Sr. Carlos Rojas', '023456789', 'info@dmedica.com', 'Av. Comercial 123', TRUE),
('Importadora Farmacéutica', 'Sra. Patricia Vargas', '024567890', 'import@ifarma.com', 'Zona Franca 456', FALSE),
('Genéricos S.A.', 'Ing. Luis Sánchez', '025678901', 'genericos@sa.com', 'Polígono Industrial 789', TRUE);

-- 5. Temperaturas
INSERT INTO temperaturas (descripcion, rango_temperatura) VALUES
('Ambiente', '15°C - 25°C'),
('Refrigerado', '2°C - 8°C'),
('Congelado', '-20°C - -10°C'),
('Fresco', '8°C - 15°C'),
('Especial', 'Consultar especificaciones');

-- 6. Productos
INSERT INTO productos (
    codigo_barras, nombre, concentracion, forma_farmaceutica, presentacion, 
    laboratorio, registro_sanitario, temperatura_id, proveedor_id, 
    categoria, stock, stock_minimo, precio_venta, estado
) VALUES
('7701234567890', 'Paracetamol', '500 mg', 'Tableta', 'Caja x 10 tabletas', 'Farmacéutica Nacional', 'RS-001', 1, 1, 'Analgésico', 150, 20, 2.50, TRUE),
('7702345678901', 'Ibuprofeno', '400 mg', 'Tableta', 'Caja x 20 tabletas', 'Laboratorios Salud', 'RS-002', 1, 2, 'Antiinflamatorio', 100, 15, 3.20, TRUE),
('7703456789012', 'Amoxicilina', '250 mg/5ml', 'Suspensión', 'Frasco 60 ml', 'Distribuidora Médica', 'RS-003', 2, 3, 'Antibiótico', 50, 10, 8.75, TRUE),
('7704567890123', 'Omeprazol', '20 mg', 'Cápsula', 'Caja x 14 cápsulas', 'Farmacéutica Nacional', 'RS-004', 1, 1, 'Antiácido', 80, 12, 5.40, TRUE),
('7705678901234', 'Insulina NPH', '100 UI/ml', 'Inyección', 'Frasco 10 ml', 'Importadora Farmacéutica', 'RS-005', 2, 4, 'Diabetes', 30, 5, 12.90, FALSE);

-- 7. Lotes
INSERT INTO lotes (
    lote_codigo, producto_id, fecha_vencimiento, cantidad_disponible, 
    precio_compra, observaciones, estado
) VALUES
('LOTE-2023-001', 1, '2025-06-30', 50, 1.80, 'Lote inicial', TRUE),
('LOTE-2023-002', 1, '2025-08-15', 100, 1.75, 'Segundo lote', TRUE),
('LOTE-2023-003', 2, '2024-12-31', 60, 2.50, NULL, TRUE),
('LOTE-2023-004', 3, '2024-05-30', 30, 6.20, 'Requiere refrigeración', TRUE),
('LOTE-2023-005', 4, '2026-01-15', 80, 4.00, 'Promoción especial', TRUE);

-- 8. Precios
INSERT INTO precios (producto_id, presentacion, equivalencia, precio_venta) VALUES
(1, 'Tableta', 1, 0.30),
(1, 'Caja x 10', 10, 2.50),
(2, 'Tableta', 1, 0.18),
(2, 'Caja x 20', 20, 3.20),
(3, 'Frasco 60ml', 1, 8.75);

-- 9. Inventario
INSERT INTO inventario (producto_id, stock_total) VALUES
(1, 150),
(2, 100),
(3, 50),
(4, 80),
(5, 30);

-- 10. Actas de Recepción
INSERT INTO actas (
    usuario_id, fecha_recepcion, ciudad, responsable, numero_factura, 
    proveedor_id, tipo_acta, observaciones, cargada_inventario, estado
) VALUES
(3, '2023-01-15', 'Quito', 'María González', 'FAC-001-0001', 1, 'Compra', 'Pedido regular', TRUE, 'Aprobada'),
(3, '2023-02-20', 'Quito', 'María González', 'FAC-002-0002', 2, 'Compra', 'Productos frágiles', TRUE, 'Aprobada'),
(5, '2023-03-10', 'Quito', 'Pedro Ramírez', 'FAC-003-0003', 3, 'Donación', 'Donación MINSAL', FALSE, 'Borrador'),
(3, '2023-04-05', 'Quito', 'María González', 'FAC-004-0004', 1, 'Compra', 'Pedido urgente', TRUE, 'Aprobada'),
(3, '2023-05-12', 'Quito', 'María González', 'FAC-005-0005', 4, 'Compra', 'Productos refrigerados', TRUE, 'Aprobada');

-- 11. Detalle Actas de Recepción
INSERT INTO actas_productos (acta_id, producto_id, lote_id, cantidad_recibida, precio_compra) VALUES
(1, 1, 1, 50, 1.80),
(1, 4, 5, 30, 4.00),
(2, 2, 3, 60, 2.50),
(3, 3, 4, 30, 6.20),
(4, 1, 2, 100, 1.75);

-- 12. Ventas
INSERT INTO ventas (
    usuario_id, cliente_id, fecha_venta, subtotal, descuento_total, 
    impuesto_total, total, metodo_pago, monto_efectivo, monto_tarjeta, 
    monto_transferencia, cambio, estado
) VALUES
(2, 2, '2023-06-01 09:15:22', 15.75, 0.00, 1.89, 17.64, 'efectivo', 20.00, 0.00, 0.00, 2.36, 'completada'),
(4, 3, '2023-06-02 11:30:45', 24.30, 2.00, 2.68, 24.98, 'tarjeta', 0.00, 25.00, 0.00, 0.02, 'completada'),
(2, 1, '2023-06-03 14:20:10', 8.75, 0.00, 1.05, 9.80, 'efectivo', 10.00, 0.00, 0.00, 0.20, 'completada'),
(4, 4, '2023-06-04 16:45:30', 32.40, 5.00, 3.29, 30.69, 'mixto', 15.00, 15.69, 0.00, 0.00, 'completada'),
(2, 5, '2023-06-05 10:10:18', 5.40, 0.00, 0.65, 6.05, 'transferencia', 0.00, 0.00, 6.05, 0.00, 'completada');

-- 13. Detalle de Ventas
INSERT INTO detalle_venta (
    venta_id, producto_id, lote_id, cantidad, precio_unitario, 
    subtotal, descuento, impuesto, total_linea
) VALUES
(1, 1, 1, 5, 2.50, 12.50, 0.00, 1.50, 14.00),
(1, 2, 3, 1, 3.20, 3.20, 0.00, 0.38, 3.58),
(2, 1, 2, 4, 2.50, 10.00, 1.00, 1.08, 10.08),
(2, 4, 5, 2, 5.40, 10.80, 1.00, 1.18, 10.98),
(3, 3, 4, 1, 8.75, 8.75, 0.00, 1.05, 9.80),
(4, 2, 3, 6, 3.20, 19.20, 3.00, 1.94, 18.14),
(4, 4, 5, 2, 5.40, 10.80, 2.00, 1.06, 9.86),
(5, 4, 5, 1, 5.40, 5.40, 0.00, 0.65, 6.05);

-- 14. Alertas de Vencimiento
INSERT INTO alertas_vencimiento (lote_id, fecha_alerta, dias_anticipacion, estado) VALUES
(4, '2024-04-30 00:00:00', 30, FALSE),
(3, '2024-11-30 00:00:00', 30, FALSE),
(1, '2025-05-31 00:00:00', 30, FALSE),
(2, '2025-07-15 00:00:00', 30, FALSE),
(5, '2025-12-15 00:00:00', 30, FALSE);

-- 15. Devoluciones
INSERT INTO devoluciones (
    venta_id, usuario_id, fecha, tipo, motivo, observaciones, 
    monto_total, metodo_reembolso, estado
) VALUES
(1, 2, '2023-06-02 10:30:00', 'parcial', 'Producto dañado', 'Cliente reportó tableta rota', 2.50, 'efectivo', 'completada'),
(3, 4, '2023-06-04 09:15:00', 'total', 'Alergia al medicamento', 'Presentó reacción alérgica', 9.80, 'credito', 'completada'),
(2, 2, '2023-06-05 16:20:00', 'parcial', 'Cambio de producto', 'Prefirió otro medicamento', 5.40, 'efectivo', 'completada');

-- 16. Detalle Devoluciones
INSERT INTO detalle_devolucion (
    devolucion_id, detalle_venta_id, cantidad_devuelta, precio_unitario, motivo, lote_id
) VALUES
(1, 1, 1, 2.50, 'Tableta rota', 1),
(2, 5, 1, 8.75, 'Reacción alérgica', 4),
(3, 6, 1, 5.40, 'Cambio por otro producto', 5);

-- 17. Facturas
INSERT INTO facturas (venta_id, cliente_id, numero_factura, fecha_emision, estado) VALUES
(1, 2, '001-001-000000001', '2023-06-01 09:15:22', 'emitida'),
(2, 3, '001-001-000000002', '2023-06-02 11:30:45', 'emitida'),
(3, 1, '001-001-000000003', '2023-06-03 14:20:10', 'emitida'),
(4, 4, '001-001-000000004', '2023-06-04 16:45:30', 'emitida'),
(5, 5, '001-001-000000005', '2023-06-05 10:10:18', 'emitida');

-- 18. Ajustes de Inventario
INSERT INTO ajustes_inventario (usuario_id, fecha, motivo, observaciones) VALUES
(3, '2023-01-20 10:00:00', 'Conteo físico', 'Diferencia encontrada en inventario'),
(5, '2023-02-15 14:30:00', 'Daño de producto', 'Varios frascos rotos'),
(3, '2023-03-10 11:15:00', 'Caducidad', 'Productos próximos a vencer'),
(3, '2023-04-05 16:45:00', 'Robo', 'Reporte de sustracción'),
(5, '2023-05-20 09:30:00', 'Donación', 'Productos donados a centro de salud');

-- 19. Detalle Ajustes de Inventario
INSERT INTO detalle_ajuste_inventario (ajuste_id, lote_id, cantidad_antes, cantidad_despues) VALUES
(1, 1, 50, 48),
(2, 4, 30, 28),
(3, 3, 60, 55),
(4, 2, 100, 95),
(5, 5, 80, 75);

-- 20. Órdenes de Compra
INSERT INTO ordenes_compra (fecha, proveedor_id, usuario_id, observaciones, estado) VALUES
('2023-01-05', 1, 3, 'Pedido regular mensual', 'Recibida'),
('2023-02-10', 2, 3, 'Pedido urgente', 'Recibida'),
('2023-03-15', 3, 5, 'Pedido con descuento', 'Pendiente'),
('2023-04-20', 4, 3, 'Productos refrigerados', 'Recibida'),
('2023-05-25', 1, 3, 'Reposición de stock', 'Cancelada');

-- 21. Detalle Órdenes de Compra
INSERT INTO detalle_orden_compra (orden_compra_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 100, 1.75),
(1, 4, 50, 4.00),
(2, 2, 80, 2.50),
(3, 3, 40, 6.20),
(4, 5, 20, 10.00);

-- 22. Órdenes de Salida
INSERT INTO ordenes_salida (fecha, usuario_id, motivo, observaciones) VALUES
('2023-01-25', 3, 'Transferencia a sucursal', 'Envío a sucursal norte'),
('2023-02-18', 5, 'Daño de producto', 'Destrucción de medicamentos vencidos'),
('2023-03-12', 3, 'Donación', 'Centro de salud comunitario'),
('2023-04-08', 3, 'Muestra médica', 'Para representante de ventas'),
('2023-05-22', 5, 'Devolución a proveedor', 'Productos defectuosos');

-- 23. Detalle Órdenes de Salida
INSERT INTO detalle_orden_salida (orden_salida_id, lote_id, cantidad) VALUES
(1, 1, 10),
(1, 2, 15),
(2, 4, 5),
(3, 3, 8),
(4, 5, 3);

-- 24. Historial de Cambios
INSERT INTO historial_cambios (usuario_id, tabla, accion, fecha, detalles) VALUES
(1, 'productos', 'creación', '2023-01-01 08:00:00', 'Creación de nuevo producto Paracetamol'),
(2, 'ventas', 'registro', '2023-06-01 09:15:22', 'Venta #1 registrada'),
(3, 'inventario', 'ajuste', '2023-01-20 10:00:00', 'Ajuste por conteo físico'),
(4, 'ventas', 'devolución', '2023-06-04 09:15:00', 'Devolución total de venta #3'),
(5, 'lotes', 'vencimiento', '2023-05-20 11:30:00', 'Actualización fecha vencimiento lote #5');