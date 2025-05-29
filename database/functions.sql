
    -- Función para calcular Precio de compra Promedio Ponderado
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


	--funcion para actualizar stock
	CREATE OR REPLACE FUNCTION actualizar_stock_producto()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el stock del producto cuando cambia la cantidad disponible de un lote
  UPDATE productos 
  SET stock = (
    SELECT COALESCE(SUM(cantidad_disponible), 0)
    FROM lotes
    WHERE producto_id = NEW.producto_id
    AND estado = true
    AND fecha_vencimiento >= CURRENT_DATE
  )
  WHERE producto_id = NEW.producto_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para inserciones/actualizaciones en lotes
CREATE TRIGGER trg_after_lote_change
AFTER INSERT OR UPDATE OF cantidad_disponible ON lotes
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_producto();

-- Trigger para eliminación/cambios de estado en lotes
CREATE TRIGGER trg_after_lote_status_change
AFTER UPDATE OF estado OR DELETE ON lotes
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_producto();


-- Modificar la función existente de devoluciones
CREATE OR REPLACE FUNCTION actualizar_stock_devolucion()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar lote
  IF NEW.lote_id IS NOT NULL AND NEW.cantidad_devuelta > 0 THEN
    UPDATE lotes 
    SET cantidad_disponible = cantidad_disponible + NEW.cantidad_devuelta
    WHERE lote_id = NEW.lote_id;
  END IF;
  
  -- La actualización del producto será manejada por el trigger trg_after_lote_change
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
