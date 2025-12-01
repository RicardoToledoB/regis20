# Guía de Carga de Datos - REGIS20

## Orden de Carga (Jerárquico)

Esta carpeta contiene archivos JSON con datos para inicializar la base de datos. **Deben cargarse en el orden especificado** para respetar las relaciones de dependencia.

### 📋 Orden de Carga Recomendado

1. **01_communes.json** - Comunas (Base)
   - Sin dependencias
   - Contiene: Punta Arenas, Puerto Natales, Porvenir, Timaukel, San Gregorio

2. **02_institutions.json** - Instituciones (Base)
   - Sin dependencias
   - Contiene: Carabineros, PDI, Fiscalía, Servicio de Salud

3. **03_institution_types.json** - Tipos de Institución (Depende de: Communes, Institutions)
   - Combina communes e institutions
   - Contiene: Comisaría, Brigada de Droga, etc.

4. **04_grades.json** - Grados (Depende de: Institution Types)
   - Contiene: Subteniente, Sargento, Cabo, Inspector, Detective, Técnico

5. **05_packagings.json** - Contenedores/Empaques (Base)
   - Sin dependencias
   - Contiene: Bolsa plástica, Botella de vidrio, Frasco, Tubo de ensayo, etc.

6. **06_substances_types.json** - Tipos de Sustancias (Base)
   - Sin dependencias
   - Contiene: Cocaína, Marihuana, Heroína, Metanfetamina, MDMA, LSD, Fentanilo

7. **07_storages.json** - Bodegas/Almacenes (Base)
   - Sin dependencias
   - Contiene: Bodega Principal, Bodega Climatizada, Bodega de Drogas, etc.

8. **08_storage_locations.json** - Ubicaciones en Bodega (Depende de: Storages)
   - Define estantes y secciones específicas
   - Contiene ubicaciones físicas dentro de bodegas

9. **09_methods_destructions.json** - Métodos de Destrucción (Base)
   - Sin dependencias
   - Contiene: Incineración, Química, Trituración, Enterramiento, Compostaje

10. **10_destinations.json** - Destinos/Laboratorios (Base)
    - Sin dependencias
    - Contiene: Laboratorio Central, Instituto de Toxicología, Laboratorio Forense, Centro Químico

11. **11_roles.json** - Roles de Usuario (Base)
    - Sin dependencias
    - Contiene: Administrador, Operador, Analista, Visualizador, Supervisor

12. **12_users.json** - Usuarios (Depende de: Roles)
    - Contiene: Admin, Operador, Analista, Supervisor

13. **13_polices.json** - Policías (Depende de: Grades, Institutions, Institution Types, Communes)
    - Contiene registros de personal policial
    - Incluye datos de 3 policías de ejemplo

## 🔗 Gráfico de Dependencias

```
Communes (Base)
     ↓
Institution_Types ← Institutions (Base)
     ↓
Grades
     ↓
Polices ← Grades, Institutions

Packagings (Base)
Substances_Types (Base)
Storages (Base)
     ↓
Storage_Locations
Methods_Destructions (Base)
Destinations (Base)
Roles (Base)
     ↓
Users
```

## ⚙️ Instrucciones de Carga

### Opción 1: API REST (Manual)

```bash
# Para cada archivo en orden:
curl -X POST http://localhost:8080/api/v1/communes \
  -H "Content-Type: application/json" \
  -d @01_communes.json
```

### Opción 2: Script de Carga (Recomendado)

Crear un script que lea los archivos en orden y haga POST a cada endpoint correspondiente.

### Opción 3: Importar en Base de Datos Directamente

Si tienes acceso a la BD, puedes usar herramientas como pgAdmin, MySQL Workbench, etc.

## 📝 Campos Requeridos por Entidad

| Entidad              | Campos Requeridos                                         | Campos Opcionales                                                    |
| -------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| Communes             | id, name                                                  | region                                                               |
| Institutions         | id, name                                                  | description                                                          |
| Institution_Types    | id, name, commune, institution                            | description                                                          |
| Grades               | id, name, institutionType                                 | description                                                          |
| Packagings           | id, name                                                  | description, volume                                                  |
| Substances_Types     | id, name                                                  | description                                                          |
| Storages             | id, name                                                  | description, capacity, location                                      |
| Storage_Locations    | id, name, section, shelf, storage                         | description                                                          |
| Methods_Destructions | id, name                                                  | description                                                          |
| Destinations         | id, name                                                  | description, contact                                                 |
| Roles                | id, name, permissions                                     | description                                                          |
| Users                | id, username, password, email, role                       | firstName, secondName, firstLastName, secondLastName, rut, cellphone |
| Polices              | id, rut, firstName, firstLastName, grade, institutionType | secondName, secondLastName, email, cellphone, institution            |

## ✅ Validación Post-Carga

Después de cargar todos los datos, verifica:

1. ✓ Que no haya valores NULL en campos requeridos
2. ✓ Que las referencias externas sean válidas (IDs deben existir)
3. ✓ Que los datos sean únicos donde sea necesario (RUT, username, email)
4. ✓ Que el conteo total de registros sea correcto

---

**Última actualización**: 25 de Noviembre de 2025
**Formato**: JSON
**Compatibilidad**: Compatible con Spring Boot + JPA
