# BlueCheck

TFG de desarrollo web del Grado de Ingeniería Informática.

BlueCheck ofrece una plataforma colaborativa en la que poder consultar el estado de las playas de Cataluña, a partir de datos oficiales de la Generalitat de Cataluña, además de implementar un sistema de reportes que aportan datos 100% actualizados.

---

## Guía de instalación

### Requisitos previos

Antes de comenzar con la instalación de la aplicación en local, será necesario tener instalados **Docker** y **Docker Compose**. Para hacerlo en Windows, con instalar **Docker Desktop** es suficiente.

Para instalarlo, se debe seguir la documentación oficial:

* [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)

---

### Pasos para la instalación

1. Descargar o clonar el código fuente del repositorio:

   * [https://github.com/cmarquez07/BlueCheck](https://github.com/cmarquez07/BlueCheck)

2. Si se ha descargado el archivo comprimido, se debe descomprimir.

3. Crear los archivos `.env` necesarios:

   #### 3.1 Archivo `.env` en la raíz del proyecto

   Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

   ```env
   POSTGRES_DB=[db_name]
   POSTGRES_USER=[db_user]
   POSTGRES_PASSWORD=[db_password]
   POSTGRES_URL=bluecheck-db
   POSTGRES_PORT=5432

   SONAR_TOKEN=[sonar_token]
   ```

   En este archivo, se deben sustituir los valores que están entre claudators `[]` por el valor real.

   Para los valores relacionados con Postgres, se puede introducir cualquier valor, ya que el `docker-compose` creará la base de datos a partir de estos valores, aunque `POSTGRES_URL` y `POSTGRES_PORT` dependen del nombre y del puerto del contenedor de la base de datos.

   Para la variable `SONAR_TOKEN` se debe acceder a la interfaz de **SonarQube** (una vez arrancados los contenedores, más adelante) y crear un **TOKEN GLOBAL DE SESIÓN**. En el apartado **Configuración de SonarQube** se explica con más detalle.

   #### 3.2 Archivo `frontend/.env`

   Crear un archivo `frontend/.env`, que tendrá la variable `VITE_API_URL`, de forma que el frontend pueda contactar con el backend.

   Esta variable se ha creado por el hecho de que el mismo código debe poder contactar con el backend tanto en local como en el entorno de producción. Así, utilizando esta variable, en cada entorno se puede configurar la variable necesaria.

   El contenido será el siguiente:

   ```env
   VITE_API_URL=http://localhost:3002
   ```

   #### 3.3 Archivo `backend/.env`

   Crear un archivo `backend/.env` con la siguiente estructura:

   ```env
   BACKEND_PORT=3002

   # Database
   POSTGRES_DB=[db_name]
   POSTGRES_USER=[db_user]
   POSTGRES_PASSWORD=[db_password]
   POSTGRES_URL=bluecheck-db
   POSTGRES_PORT=5432

   # JWT
   JWT_SECRET=

   # Resend
   RESEND_API_KEY=
   ```

   En este archivo también se deben sustituir los valores entre claudators, indicando los mismos valores que se han indicado en el archivo anterior, ya que estos servirán para la conexión a la base de datos por parte del backend.

   Además, se debe crear una clave para JWT y se debe conseguir una API KEY de Resend.

   ##### 3.3.1 JWT Secret

   Para conseguir una clave para JWT, se abre el PowerShell de Windows y se ejecuta el siguiente comando:

   ```powershell
   [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

   Una vez ejecutado, se copia la cadena aleatoria que devuelve para establecerla como variable de entorno.

   Otra forma de conseguir esta cadena es instalar Node en la máquina y ejecutar en el terminal (por ejemplo, CMD) el siguiente comando:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

   Al igual que con el comando anterior, se copia la cadena resultante y se establece la variable de entorno.

   ##### 3.3.2 Resend API key

   Para obtener una API key de Resend, se debe acceder a [https://resend.com](https://resend.com) y crear una cuenta.

   Una vez se ha creado la cuenta, se accede a:

   * [https://resend.com/api-keys](https://resend.com/api-keys)

   Se genera una nueva API key y se copia para establecer la variable de entorno.

4. Ejecutar **Docker Desktop** para arrancar el sistema Docker.

   Este paso es **IMPORTANTE**, ya que si no se abre primero no podrá descargar las imágenes correspondientes.

5. Abrir un terminal en la raíz de la aplicación y ejecutar el siguiente comando:

   ```bash
   docker compose up --build
   ```

6. Una vez arrancados todos los contenedores, aunque no es necesario, existe la opción de configurar **Nginx Proxy Manager (NPM)**.

   En caso de no querer configurarlo, se puede saltar este paso.

   Si se quiere configurar, de forma que luego se facilite ligeramente el acceso a la aplicación, se debe acceder a `localhost:81` e indicar los datos que se piden.

   Una vez dentro, se puede configurar de la misma forma que se comenta en el apartado **"3.2.3. Configuración de Nginx Proxy Manager"** de la memoria del proyecto.

7. Acceder en el navegador a un endpoint específico del backend:

   * Si se ha configurado NPM:

     ```text
     localhost/api/insert-locations
     ```

   * En caso contrario:

     ```text
     localhost:3002/api/insert-locations
     ```

   Este paso es necesario para insertar en la base de datos las ubicaciones de todas las playas, obtenidas a partir del endpoint del backend de la API oficial, de forma que el sistema pueda calcular correctamente las playas cercanas en la ficha de detalle de las playas.

   Una vez que se vea una respuesta en formato de texto, ya se habrá insertado correctamente.

   *(Esto solo se hace en el entorno local, ya que la base de datos está vacía por defecto)*

8. Acceso al frontend de la aplicación:

   * Con NPM configurado:

     ```text
     localhost
     ```

     (sin indicar ningún puerto)

   * Sin NPM:

     ```text
     localhost:3001
     ```

---

## Configuración de SonarQube

1. Acceder a SonarQube una vez levantados los contenedores:

   ```text
   localhost:9000
   ```

2. Acceder con las credenciales por defecto:

   ```text
   admin : admin
   ```

3. Cambiar la contraseña por una nueva.

4. Acceder al apartado **My Account → Security**:

   ```text
   http://localhost:9000/account/security
   ```

5. Generar un token indicando un nombre identificativo, de tipo **Global Analysis Token**, y seleccionar el tiempo de expiración.

6. Copiar el token generado e introducirlo en el archivo `.env` de la raíz del proyecto.

7. Para ejecutar los análisis, descomentar las líneas correspondientes del archivo `docker-compose.yml`:

   * Desde la línea 97 a la 107
   * Desde la línea 111 a la 121

8. Para obtener la cobertura en el análisis, primero se deben ejecutar los tests en el entorno del que se quiera obtener cobertura.

   Acceder al terminal del contenedor correspondiente y ejecutar los tests:

   **Frontend:**

   ```bash
   docker exec -it bluecheck-frontend /bin/sh
   /app # npm run test -- --coverage
   /app # exit
   ```

   **Backend:**

   ```bash
   docker exec -it bluecheck-backend /bin/sh
   /app # npm run test
   /app # exit
   ```

9. Ejecutar el análisis desde la raíz del proyecto:

   * Frontend:

     ```bash
     docker compose run --rm sonar-frontend
     ```

   * Backend:

     ```bash
     docker compose run --rm sonar-backend
     ```

10. Una vez finalizado el análisis, los resultados estarán disponibles en la interfaz web de SonarQube.
