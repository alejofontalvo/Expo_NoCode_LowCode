# FinanceApp

FinanceApp es una aplicación móvil desarrollada con **React Native**, **Expo** y **TypeScript**, orientada al registro y visualización de ingresos, gastos, metas financieras y resumen del estado financiero diario del usuario.

El proyecto fue construido como una solución demostrativa para presentar una experiencia sencilla, moderna y visual de administración financiera personal desde dispositivos móviles.

## Presentación del proyecto

Las diapositivas de presentación del proyecto se encuentran disponibles en el siguiente enlace:

[Ver diapositivas en Google Drive](https://drive.google.com/file/d/1v0gCvu1Qsa9axlc7HDEmvC-GtvQu33Iv/view?usp=sharing)

## Funcionalidades principales

- Registro de ingresos y gastos.
- Clasificación de transacciones por categorías.
- Visualización del ingreso diario, gasto diario y saldo disponible.
- Indicador visual del porcentaje disponible del ingreso.
- Resumen de gastos por categoría.
- Sección de metas financieras.
- Pantalla de ajustes de usuario.
- Navegación inferior entre secciones principales.
- Modal interactivo para agregar nuevas transacciones.
- Interfaz moderna con tema oscuro, tarjetas, barras de progreso y elementos visuales.

## Tecnologías utilizadas

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **React Navigation**
- **React Native Reanimated**
- **Expo Vector Icons**

## Estructura general del proyecto

```bash
FinanceApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx
│   └── modal.tsx
├── components/
├── constants/
├── hooks/
├── scripts/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Descripción de pantallas

### Inicio

Muestra el resumen financiero del día, incluyendo ingresos, gastos, saldo disponible, porcentaje utilizado del ingreso y transacciones recientes.

### Resumen

Permite visualizar los gastos agrupados por categoría mediante barras de progreso, facilitando el análisis del comportamiento financiero del usuario.

### Metas

Presenta metas financieras predeterminadas con valores ahorrados, objetivos y porcentaje de avance.

### Ajustes

Incluye opciones visuales relacionadas con perfil, notificaciones, moneda, tema, seguridad y exportación de datos.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- npm
- Expo CLI o usar Expo mediante `npx`
- Expo Go en el celular, si deseas probarlo desde un dispositivo físico

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/alejofontalvo/Expo_NoCode_LowCode.git
```

Ingresa a la carpeta del proyecto:

```bash
cd Expo_NoCode_LowCode
```

Instala las dependencias:

```bash
npm install
```

## Ejecución del proyecto

Para iniciar el servidor de desarrollo de Expo:

```bash
npm start
```

o también:

```bash
npx expo start
```

Luego puedes abrir la aplicación en:

- Expo Go escaneando el código QR.
- Emulador Android.
- Simulador iOS.
- Navegador web.

## Comandos disponibles

```bash
npm start
```

Inicia el proyecto con Expo.

```bash
npm run android
```

Ejecuta el proyecto en un emulador o dispositivo Android.

```bash
npm run ios
```

Ejecuta el proyecto en un simulador o dispositivo iOS.

```bash
npm run web
```

Ejecuta el proyecto en navegador web.

```bash
npm run lint
```

Ejecuta la revisión de código con Expo Lint.

## Estado actual del proyecto

El proyecto se encuentra en una versión inicial funcional. Actualmente permite registrar transacciones durante la sesión de uso y visualizar información financiera básica. Los datos se manejan de manera local en el estado de la aplicación.

## Posibles mejoras futuras

- Persistencia de datos con almacenamiento local o base de datos.
- Inicio de sesión y perfiles de usuario.
- Exportación real de reportes en CSV o PDF.
- Gráficas financieras más avanzadas.
- Personalización de moneda.
- Integración con servicios financieros externos.
- Notificaciones y recordatorios de gastos o metas.

## Autor

Proyecto desarrollado por **Alejandro Fontalvo y Sibeli Rodriguez**.

## Licencia

Este proyecto se presenta con fines académicos, demostrativos y de aprendizaje.

