-- OPCIONAL: el servidor ya crea la base y la tabla solo al arrancar.
-- Usá este script en SSMS (conectado a (localdb)\MSSQLLocalDB) si preferís crearlas a mano.
IF DB_ID(N'MartinDelValle') IS NULL CREATE DATABASE MartinDelValle;
GO
USE MartinDelValle;
GO
IF OBJECT_ID(N'dbo.inscripciones', N'U') IS NULL
CREATE TABLE dbo.inscripciones (
  id        INT IDENTITY(1,1) PRIMARY KEY,
  nombre    NVARCHAR(80)   NOT NULL,
  whatsapp  NVARCHAR(30)   NOT NULL,
  email     NVARCHAR(120)  NOT NULL CONSTRAINT DF_insc_email DEFAULT '',
  clase     NVARCHAR(80)   NOT NULL CONSTRAINT DF_insc_clase DEFAULT '',
  nivel     NVARCHAR(40)   NOT NULL CONSTRAINT DF_insc_nivel DEFAULT '',
  mensaje   NVARCHAR(1000) NOT NULL CONSTRAINT DF_insc_msg DEFAULT '',
  estado    NVARCHAR(12)   NOT NULL CONSTRAINT DF_insc_estado DEFAULT 'nuevo'
            CONSTRAINT CK_insc_estado CHECK (estado IN ('nuevo','contactado','inscripto','descartado')),
  nota      NVARCHAR(500)  NOT NULL CONSTRAINT DF_insc_nota DEFAULT '',
  creado_en DATETIME2      NOT NULL CONSTRAINT DF_insc_fecha DEFAULT SYSUTCDATETIME()
);
GO
SELECT * FROM dbo.inscripciones ORDER BY id DESC;  -- ver los datos
