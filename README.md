# iPanic Reader Web

Analizador profesional de Panic Logs para técnicos avanzados. Compatible desde iPhone XS hasta 16 Pro Max.

## 🚀 Características

- **Análisis completo**: Detecta y analiza códigos de error en Panic Logs
- **Amplia compatibilidad**: iPhone XS hasta iPhone 16 Pro Max
- **100% local**: No se envían datos a servidores externos
- **Base de datos actualizada**: Más de 71 códigos documentados
- **Exportación PDF**: Genera reportes profesionales
- **Interfaz intuitiva**: Drag & drop para cargar archivos
- **Detección automática**: Identifica modelo y severidad

## 🛠️ Tecnologías

- **Frontend**: Nuxt 3 + Vue.js + TypeScript
- **Estilos**: Tailwind CSS + CSS personalizado
- **Análisis**: Motor de parsing JavaScript nativo
- **Exportación**: jsPDF + html2canvas
- **Deployment**: Vercel / Netlify / Estático

## 📋 Requisitos

- Node.js >= 18.20
- npm o yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🚀 Instalación y uso

### Desarrollo local

```bash
# Clonar repositorio
git clone <repository-url>
cd Panic-Full-Web-main

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Build para producción

```bash
# Build estático
npm run generate

# Build con servidor
npm run build
```

### Deploy en Vercel

1. Importar repositorio en Vercel
2. Seleccionar framework: **Nuxt 3**
3. Deploy automático

## 📱 Modelos compatibles

### Serie XS/XR
- iPhone XS / XS Max
- iPhone XR

### Serie 11/12
- iPhone 11 / 11 Pro / 11 Pro Max
- iPhone 12 / 12 Mini / 12 Pro / 12 Pro Max

### Serie 13/14
- iPhone 13 / 13 Mini / 13 Pro / 13 Pro Max
- iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max

### Serie 15/16
- iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max
- iPhone 16 / 16 Plus / 16 Pro / 16 Pro Max

## 🔍 Tipos de códigos detectados

### Códigos de texto
- `Mic1` - Micrófono inferior / Barómetro
- `TG0B` - Telemetría de batería
- `ANS2` - Controlador NAND/NVMe
- `AOP PANIC` - Always-On Processor
- Y muchos más...

### Códigos hexadecimales
- `0x800` - Flex de carga (iPhone 13)
- `0x20000` - Interposer (iPhone 14 Pro)
- `0x310000` - USB-C (iPhone 16)
- Y muchos más...

## 📊 Niveles de severidad

- **🟢 LOW**: Problemas menores
- **🟡 MEDIUM**: Inestabilidad ocasional
- **🟠 HIGH**: Requiere reparación
- **🔴 CRITICAL**: Daño potencial

## 🎯 Cómo usar

1. **Obtener Panic Log**: Usa iTunes, 3uTools o Console.app
2. **Cargar archivo**: Arrastra o selecciona el archivo .txt/.log
3. **Analizar**: Haz clic en "Analizar"
4. **Revisar resultados**: Ve las soluciones recomendadas
5. **Exportar**: Genera PDF del reporte (opcional)

## 🔧 Estructura del proyecto

```
├── components/          # Componentes Vue
│   ├── panic/          # Componentes específicos de análisis
│   └── ui/             # Componentes de interfaz
├── composables/        # Composables de Vue
├── core/               # Lógica de negocio
├── layouts/            # Layouts de Nuxt
├── pages/              # Páginas de la aplicación
├── server/             # API y lógica del servidor
│   ├── api/           # Endpoints de API
│   ├── assets/        # Base de datos JSON
│   └── engine/        # Motor de análisis
├── types/              # Definiciones TypeScript
└── public/             # Assets estáticos
```

## 🛡️ Privacidad y seguridad

- **Análisis local**: Todo el procesamiento se hace en el navegador
- **Sin tracking**: No se registran datos del usuario
- **Sin servidores**: Los archivos no se envían a ningún servidor
- **Código abierto**: Transparencia total del funcionamiento

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Scripts disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run generate     # Build estático
npm run preview      # Preview build
npm run lint         # Linter
npm run lint:fix     # Fix automático
npm run typecheck    # Verificar tipos
npm run format       # Formatear código
```

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👨‍💻 Autor

**Antonio Ayala** - Desarrollador especializado en herramientas de reparación móvil.

## 🆘 Soporte

Para reportar bugs o solicitar funcionalidades, crear un issue en el repositorio.

---

**⚠️ Nota importante**: Esta herramienta está diseñada para técnicos profesionales. El análisis de Panic Logs requiere conocimientos técnicos para interpretar correctamente los resultados.
 
